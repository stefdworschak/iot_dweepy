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
buzzer = 8

# Setting the sensor type for the Temperature and Humidity Sensor
dht_sensor_type = 0

grovepi.pinMode(light_sensor,"INPUT")
grovepi.pinMode(button_sensor,"INPUT")
grovepi.pinMode(potentiometer,"INPUT")
grovepi.pinMode(led,"OUTPUT")
grovepi.pinMode(buzzer,"OUTPUT")

# LCD is on port I2C-1
setRGB(0,255,0)

last = {}
prevBtn = 0
menuActive = 0
prevDegrees = 0
thread_id = 0
thread_id2 = 0

# Variables necessary to calculate degrees
adc_ref = 5
grove_vcc = 5
full_angle = 300

# Variables to check whether alarm is snoozed and for how long 
# In order to enable it after a certain time
snooze = 0
snooze_count = 0

# Function that checks if the alarm should sound or not
# And check if it is snoozing, increment the snooze counter 
# And reset the snooze variables
#def alarm_sound(threadname):
def alarm_sound():
    global snooze
    global button_sensor_value
    global led
    global snooze_count
    print("Snooze: " + str(snooze))
    print("Button: " + str(button_sensor_value))
    print("Snooze Count: " + str(snooze_count))
    if snooze == 0:
        print("no snooze")
        grovepi.digitalWrite(led,1)
        grovepi.digitalWrite(buzzer,1)
        setText_norefresh("Alarm! Alarm!   \nGet up tha fuck!    \n")
        snooze = 1 if button_sensor_value == 1 else 0
    elif snooze == 1 and snooze_count > 20:
        print("snooze")
        grovepi.digitalWrite(led,0)
        grovepi.digitalWrite(buzzer,0)
        setText_norefresh(datetime.datetime.now().strftime('%d%b%y') + " " + datetime.datetime.now().strftime('%H:%M:%S')
            + "\n" + "Ill: " + str(light_sensor_value) + " / " + str(threshold))  
        snooze = 0
        snooze_count = 0
    else: 
        print("inc snooze count")
        grovepi.digitalWrite(led,0)
        grovepi.digitalWrite(buzzer,0)
        setText_norefresh(datetime.datetime.now().strftime('%d%b%y') + " " + datetime.datetime.now().strftime('%H:%M:%S')
            + "\n" + "Ill: " + str(light_sensor_value) + " / " + str(threshold))  
        snooze_count += 1 
    
    thread.exit()
    return button_sensor_value

# function to send
def send_info(threadname, url):
    print(url)
    global last
    global temp
    if last != temp:
        #dweepy.dweet_for(thing_id,temp)
        res = grequests.post(url, data=temp)
        print(grequests.map([res]))
    thread.exit()

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

        # Max degrees on the rotary angle sensor is 300
        # Illuminance goes up to around 700-800 so it will need to be above that  
        threshold = degrees * 3

        if light_sensor_value > threshold:
            alarm_sound()
            #try:
            #    thread.start_new_thread(alarm_sound,("Thread2-"+str(thread_id),))
            #except:
            #    print("Error starting thread for alarm sound. ")
        else:
            grovepi.digitalWrite(led,0)
            grovepi.digitalWrite(buzzer,0)
            setText_norefresh(datetime.datetime.now().strftime('%d%b%y') + " " + datetime.datetime.now().strftime('%H:%M:%S')
            + "\n" + "Ill: " + str(light_sensor_value) + " / " + str(threshold))        

        # Fill dict with all readings
        temp['time'] = datetime.datetime.now()
        temp['illuminance'] = light_sensor_value
        temp['button_value'] = button_sensor_value
        temp['temperature'] = tempr
        temp['humidity'] = hum
        temp['threshold'] = threshold
        temp['snooze_counter'] = snooze_count

        # Open file with static data and add it to the dataset 
        with open('data.json') as file:
            json_data = json.loads(file.read())
            thing_id = json_data['thing_id']
            temp['thing_id'] = thing_id
            temp['location'] = json_data['location']
            file.close()

        # Create dweet.io URL
        url = "https://dweet.io/dweet/for/test_"+thing_id
        
        # Create a new thread every time 
        # when sending the information to dweet.io
        # in order to avoid delay from synchonous event
        try:
            thread.start_new_thread( send_info, ("Thread-"+str(thread_id), url, ) )
        except:
            print("Error: unable to start thread")

        # Class function to save data to database
        response = m.insert_into(temp)

        # Set a timeout of 0.6 
        # It seems that 1s is too long because of the code that has already been running
        last = temp
        time.sleep(0.6)

    # Check for errors
    except (IOError, TypeError, NameError) as e:
        print(str(e))
        setText("")
        setRGB(0,0,0)
        grovepi.digitalWrite(led,0)
        grovepi.digitalWrite(buzzer,0)
        break

    except Exception as e:
        print(str(e))
        setText("")
        setRGB(0,0,0)
        grovepi.digitalWrite(led,0)
        grovepi.digitalWrite(buzzer,0)
        break

    except KeyboardInterrupt:
        setText("")
        setRGB(0,0,0)
        grovepi.digitalWrite(led,0)
        grovepi.digitalWrite(buzzer,0)
        break
