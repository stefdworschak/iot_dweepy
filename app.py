import time
import json
import datetime
import grequests
import thread

import grovepi
from grovepi import *
from grove_rgb_lcd import *
import dweepy

import mongo_db as m

# Digital input ports
# SIG,NC,VCC,GND
dht_sensor_port = 7 # Temperature and Humidity sensor on D7

# Analog input ports
# SIG,NC,VCC,GND
potentiometer = 0 # Angle sensor on A0
light_sensor = 1 # Light sensor on A1
button_sensor = 3
led = 4

# Setting the sensor type for the Temperature and Humidity Sensor
dht_sensor_type = 0

grovepi.pinMode(light_sensor,"INPUT")
grovepi.pinMode(button_sensor,"INPUT")
grovepi.pinMode(potentiometer,"INPUT")
grovepi.pinMode(led,"OUTPUT")

# LCD is on port I2C-1
setRGB(0,255,0)

last = {}
prevBtn = 0
menuActive = 0
prevDegrees = 0
thread_id = 0
thread_id2 = 0

adc_ref = 5
grove_vcc = 5
full_angle = 300

snooze = 0
snooze_count = 0

    #def alarm_sound(threadname, button_sensor_value, snooze, snooze_count):
    def alarm_sound(threadname):
        global snooze
        global button_sensor_value
        global led
        global snooze_count
        print("Snooze: " + str(snooze))
        print("Button: " + str(button_sensor_value))
        print("Button: " + str(snooze_count))
        if snooze == 0:
            grovepi.digitalWrite(led,1)
            setText_norefresh("Alarm! Alarm!   \nGet up tha fuck!    \n")
            snooze = 1 if button_sensor_value == 1 else 0
        elif snooze == 1 and snooze_count < 10:
            snooze = 0
            snooze_count = 0
            
        return button_sensor_value

    #else:
    #    setText_norefresh("No Alarm!!")
    #    print(snooze)

while True:
    try:
        temp = {}
        thread_id += 1
        thread_id2 += 2

        light_sensor_value = grovepi.analogRead(light_sensor)
        [ tempr,hum ] = dht(dht_sensor_port,dht_sensor_type)
        sensor_value = grovepi.analogRead(potentiometer)
        button_sensor_value = grovepi.digitalRead(button_sensor)

        # Calculate voltage and degrees
        voltage = round((float)(sensor_value) * adc_ref / 1023, 2)
        degrees = round((voltage * full_angle) / grove_vcc, 2)
        threshold = degrees * 2

        if light_sensor_value > threshold:
            #thread.start_new_thread(alarm_sound,("Thread2-"+str(thread_id),button_sensor_value,snooze, snooze_count,))
            thread.start_new_thread(alarm_sound,("Thread2-"+str(thread_id),))
        else:
            setText_norefresh(datetime.datetime.now().strftime('%d%b%y') + " " + datetime.datetime.now().strftime('%H:%M:%S')
            + "\n" + "Ill: " + str(light_sensor_value) + " / " + str(threshold))        

        # Fill dict with all readings
        temp['time'] = datetime.datetime.now()
        temp['illuminance'] = light_sensor_value
        temp['button_value'] = button_sensor_value
        temp['temperature'] = tempr
        temp['humidity'] = hum
        temp['threshold'] = threshold

        # Open file with static data and add it to the dataset 

        with open('data.json') as file:
            json_data = json.loads(file.read())
            thing_id = json_data['thing_id']
            temp['thing_id'] = thing_id
            temp['location'] = json_data['location']

        url = "https://dweet.io/dweet/for/test_"+thing_id
        
        
        # Create a new thread every time 
        # when sending the information to dweet.io
        # in order to avoid delay from synchonous event
        def send_info(threadname, url):
            print(url)
            if last != temp:
                #dweepy.dweet_for(thing_id,temp)
                res = grequests.post(url, data=temp)
                print(grequests.map([res]))

        try:
            thread.start_new_thread( send_info, ("Thread-"+str(thread_id), url, ) )
        except:
            print("Error: unable to start thread")

        # Create a new thread everytime the alarm is triggered
        # This is to play a melody


        response = m.insert_into(temp)

        # Set a timeout of one second
        last = temp
        time.sleep(0.6)

    except (IOError, TypeError, NameError) as e:
        print(str(e))
        setText("")
        setRGB(0,0,0)
        break

    except Exception as e:
        print(str(e))
        setText("")
        setRGB(0,0,0)
        break

    except KeyboardInterrupt:
        setText("")
        setRGB(0,0,0)
        #setText_norefresh(datetime.datetime.now().isoformat())
        #grovepi.analogWrite(led,0)
        break
