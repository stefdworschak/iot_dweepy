import json

temp = {}

with open('data.json') as file:
    json_data = json.loads(file.read())
    thing_id = json_data['thing_id']
    temp['location'] = json_data['location']