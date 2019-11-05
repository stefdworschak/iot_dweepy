import pymongo

def insert_into(record):
    myclient = pymongo.MongoClient('mongodb://localhost:28017/')
    db = myclient['iot_dweepy']
    col = db['records']

    x = col.insert_one(record)