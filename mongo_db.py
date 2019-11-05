import pymongo
import json

def insert_into(record):
    myclient = pymongo.MongoClient('mongodb://localhost:28017/')
    db = myclient['iot_dweepy']
    col = db['records']

    try:
        x = col.insert_one(json.dumps(record))
    except Exception as e:
        print(str(e))