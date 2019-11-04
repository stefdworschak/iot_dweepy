import time
import json

import grovepi
from grovepi import *
from grove_rgb_lcd import *
import dweepy

# Digital input ports
# SIG,NC,VCC,GND
led = 5

# Analog input ports
# SIG,NC,VCC,GND
potentiometer = 0
light_sensor = 1
sound_sensor = 2
#emperatur_sensor = 1

dht_sensor_port = 7
dht_sensor_type = 0

###################
#### Constants ####
###################

# Reference voltage of ADC is 5v
adc_ref = 5

# Vcc of the grove interface is normally 5v
grove_vcc = 5

# Full value of the rotary angle is 300 degrees, as per it's specs (0 to 300)
full_angle = 300

# Threshold value to decide if it is loud or not
sound_threshold = 400

grovepi.pinMode(light_sensor,"INPUT")
grovepi.pinMode(sound_sensor,"INPUT")

last = {}

while True:
    try:
        temp = {}
        # Retrieve the potentiometer value
        potentiometer_value = grovepi.analogRead(potentiometer)
        light_sensor_value = grovepi.analogRead(light_sensor)
        sound_sensor_value = grovepi.analogRead(sound_sensor)
        #temperature_value = grovepi.temp(temperatur_sensor,'1.1')
        [ tempr,hum ] = dht(dht_sensor_port,dht_sensor_type)

        # Retrieve secondary values based on potentiometer
        voltage = round((float)(potentiometer_value) * adc_ref / 1023, 2)
        degrees = round((voltage * full_angle) / grove_vcc, 2)
        brightness = int(degrees / full_angle * 255)

        # Set the brightness for the LED
        grovepi.analogWrite(led,brightness)
        
        # Fill dict with all readings
        temp['voltage'] = voltage
        temp['degrees'] = degrees
        temp['illuminance'] = light_sensor_value
        temp['sound_value'] = sound_sensor_value
        temp['sound_category'] = 'loud' if sound_sensor_value > sound_threshold else 'silent'
        #temp['brightness'] = brightness
        temp['temperature'] = tempr
        temp['humidity'] = hum

        # Open file with static data and add it to the dataset 

        with open('data.json') as file:
            json_data = json.loads(file.read())
            thing_id = temp['thing_id']
            temp['location'] = temp['location']

        print(json.dumps(temp))
        
        #if last != temp:
            #dweepy.dweet_for('dwo_iot_BzEsQxDrq0',temp)
        
        # Set a timeout of one second
        time.sleep(1)

    except KeyboardInterrupt:
        grovepi.analogWrite(led,0)
        break
    except IOError:
        break

