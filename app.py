import time
import json

import grovepi
from grovepi import *
from grove_rgb_lcd import *

# Digital input ports
# SIG,NC,VCC,GND
led = 5

# Analog input ports
# SIG,NC,VCC,GND
potentiometer = 0
light_sensor = 1
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

grovepi.pinMode(light_sensor,"INPUT")

while True:
    try:
        temp = {}
        # Retrieve the potentiometer value
        potentiometer_value = grovepi.analogRead(potentiometer)
        light_sensor_value = grovepi.analogRead(light_sensor)
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
        #temp['brightness'] = brightness
        temp['temperature'] = tempr
        temp['humidity'] = hum

        print(json.dumps(temp))
        # Set a timeout of one second
        time.sleep(1)

    except KeyboardInterrupt:
        grovepi.analogWrite(led,0)
        break
    except IOError:
        break

