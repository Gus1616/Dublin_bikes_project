#!/usr/bin/env python3

import sqlalchemy as sqla
from sqlalchemy import create_engine
import traceback
import glob
import os
from pprint import pprint
import simplejson as json
import requests
import time
from IPython.display import display
import time
from datetime import datetime

URI = "dublin-bikesdb.cmd8vuwgew1e.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "admin"
PASSWORD = "Dbikes123"

engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URI, PORT, DB), echo=True)
sql = '''
CREATE DATABASE IF NOT EXISTS dbikes;
'''
engine.execute(sql)

sql2='''
CREATE DATABASE  IF NOT EXISTS dbikes;
'''
engine.execute(sql2)
for res in engine.execute("SHow Variables;"):
    print(res)


sql = """
CREATE TABLE IF NOT EXISTS availability_app (
number INTEGER,
available_bike_stands INTEGER,
available_bikes INTEGER,
last_update DATETIME

)

"""
try:
    res = engine.execute(sql)
    print(res.fetchall())
except Exception as e:
    print(e)

import requests
r = requests.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=0d101d6645f441b34490f9530a0f91c869debe77")
print(r)
r.json()




def stations_to_db2(text):
    stations = json.loads(text)
    print(stations)
    print(type(stations), len(stations))
    for station in stations:
        print(station)

        vals2 = [station.get("number"), station.get("available_bikes"),
        station.get("available_bike_stands"), station.get("last_update")]
        timestamp = int(vals2[3]/1000)
        vals2[3] = datetime.fromtimestamp(timestamp)
        engine.execute("insert into availability_app values(%s,%s,%s,%s)", vals2)




def main():
    while True:
        try:
            r = requests.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=0d101d6645f441b34490f9530a0f91c869debe77")
            stations_to_db2(r.text)
            print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            time.sleep(5*60)

            return
        except:
            print(traceback.format_exc())
            continue

if __name__ == '__main__':
    while True:
        try:
            main()
        except:
            print(traceback.format_exc())

            


metadata = sqla.MetaData()