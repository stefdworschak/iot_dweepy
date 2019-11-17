# CA1 IOT Principles Project
## Problem Statement
The purpose of this project was to find an application for an IoT device using a Raspberry Pi 3 B+ and a Grove Pi. Included in the Grove Pi set are multiple sensors such as Sound & Light sensor, a button or a and output devices like a buzzer or led light available.  

Deciding which of these sensors to use and in which form to apply them to a solution was crucial. First the project was just going to use as many sensors as possible, visualize and find a solution for it at a later stage, however that did not seem to produce any merit or added value.
## Solution
In the end the iOT alarm clock only uses the light sensor, the rotary angle sensor and the temperature and humidity sensor to build an IoT alarm clock that would be triggered based on the illuminance level.
## Implementation
### Grove Pi setup
![Grove Pi Diagram](stefdworschak.github.com/iot_dweepy/img/grove_pi_diagram.png)
### Alarm trigger and threshold
Based on some initial observations the light sensor would not exceed 800 lux even in room lighting conditions and based on research (en.wikipedia.org, 2019) sunrise should be around 400 lux and overcast days around 1000 lux. Therefore, the rotary angle sensor was used to set and adjust a threshold that would be used to trigger the alarm. The rotary angle sensor measures degrees from 0 to 300 and multiplying the degree by 3 seemed a good approach to test the system. Thus, this was the logic put in place.
### Multiple Threads and asynchronous requests
As per project brief the system should also send the information to dweet.io. Upon testing a considerable delay in running the script was noticed due to the delayed response from dweet.io. Since the LCD screen was displaying a timer that would depend on the script running every second considerable time delays and skips were notice. Thus, the final version of the project uses multiple threads to for sending the data to dweet.io creating a new thread each time the data is sent.

The project also uses the grequests module instead of the dweepy module to send asynchronous requests instead of synchronous (dweepy).
### MongoDB and PyMongo
In order to store the data locally the project deployed a MongoDB instance on the Raspberry Pi. Upon testing it was not possible to connect to that MongoDB instance in the first place because of the outdated version (2.6) on Raspbian. Research was performed, it was tried to install from another source and deploy MongoDB via docker, however neither solutions worked. It was not possible to find another version for Raspbian Buster, nor was it possible to install docker because it requires a 64bit OS which Raspbian is not.

In the end it was possible to make PyMongo work with the older version of MongoDB by downgrading PyMongo to version 2.8.0.

The project now uses a custom module imported to the main app which handles the insert process.
### Using a local file
The project also reads from a local .json file and retrieves the thing_id and the location of Dublin (in latitude and longitude). This is mainly used to send the information to dweet.io.
### Website & Charts
The website is currently not hosted anywhere other than the laptop it was developed on. It uses basic HTML5, CSS and jQuery. For the charts it uses amCharts (https://www.amcharts.com/) and the dweet.io JS library to retrieve the information. It uses the listen_for method which establishes a continuous connection to dweet.io and triggers a response once a new item for a specified thing_id is received.

Once the webpage returns the dweet, it retrieves the array of already stored items from localStorage and appends the newest dweet to it.

The charts are rendered on page load and are refreshed with a setTimeout() function every 2 seconds.
## Future Considerations
If this were to be a commercially viable product you would probably have to do more research on what illuminance levels at what times are relevant and how you can set the threshold more intelligent and possible automate the threshold setting completely. I would also be very interesting employ some more sensors and use them to analyse sleep patterns, alarm habits and other interesting facts.

Furthermore, with small effort it would also be possible to use python (or some cloud computing APIs such as AWS, Azure or Google Cloud) and the data collected to employ machine learning in order to adjust the illuminance threshold based on weather forecast, on personal preferences based on the snooze button usage or other factors.
### References
En.wikipedia.org. (2019). Lux. [online] Available at: https://en.wikipedia.org/wiki/Lux [Accessed 17 Nov. 2019].
