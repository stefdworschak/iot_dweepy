import pymongo
import json

def insert_into(record): 
    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    db = myclient['iot_dweepy']
    col = db['records']

    try:
        x = col.insert(record)
        return True
    except Exception as e:
        print(str(e))
        return False