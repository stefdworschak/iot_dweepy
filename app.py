import time
import json
import datetime

import grovepi
from grovepi import *
from grove_rgb_lcd import *
import dweepy

import mongo_db as m

# Digital input ports
# SIG,NC,VCC,GND
#led = 5 # LED on D5
dht_sensor_port = 7 # Temperature and Humidity sensor on D7

# Analog input ports
# SIG,NC,VCC,GND
potentiometer = 0 # Angle sensor on A0
light_sensor = 1 # Light sensor on A1
#sound_sensor = 2 # Sound sensor on A2
#emperatur_sensor = 1
button_sensor = 4

# Setting the sensor type for the Temperature and Humidity Sensor
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
grovepi.pinMode(button_sensor,"INPUT")
setRGB(0,255,0)

last = {}

while True:
    try:
        temp = {}

        # Retrieve the potentiometer value
        potentiometer_value = grovepi.analogRead(potentiometer)
        light_sensor_value = grovepi.analogRead(light_sensor)
        [ tempr,hum ] = dht(dht_sensor_port,dht_sensor_type)

        #Set Time on LCD
        setText_norefresh(datetime.datetime.now().isoformat())

        # Retrieve secondary values based on potentiometer
        voltage = round((float)(potentiometer_value) * adc_ref / 1023, 2)
        degrees = round((voltage * full_angle) / grove_vcc, 2)
        #brightness = int(degrees / full_angle * 255)

        # Set the brightness for the LED
        #grovepi.analogWrite(led,brightness)
        
        # Fill dict with all readings
        temp['voltage'] = voltage
        temp['degrees'] = degrees
        temp['illuminance'] = light_sensor_value
        temp['button_value'] = grovepi.digitalRead(button_sensor)
        #temp['sound_value'] = sound_sensor_value
        #temp['sound_category'] = 'loud' if sound_sensor_value > sound_threshold else 'silent'
        #temp['brightness'] = brightness
        temp['temperature'] = tempr
        temp['humidity'] = hum

        # Open file with static data and add it to the dataset 

        with open('data.json') as file:
            json_data = json.loads(file.read())
            thing_id = json_data['thing_id']
            temp['location'] = json_data['location']

        response = m.insert_into(temp)
        print(temp)
        #print(json.dumps(temp))
        
        #if last != temp:
            #dweepy.dweet_for('dwo_iot_BzEsQxDrq0',temp)
        
        # Set a timeout of one second
        time.sleep(1)

    except KeyboardInterrupt:
        #grovepi.analogWrite(led,0)
        break
    except IOError:
        break

