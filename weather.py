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
for res in engine.execute("Show Variables;"):
    print(res)

sql = """
CREATE TABLE IF NOT EXISTS weather (
id INTEGER,
main1 VARCHAR(256),
description1 VARCHAR(256),
icon VARCHAR(256),
temperature FLOAT,
humidity INTEGER,
windspeed DOUBLE,
winddirection INTEGER,
sunrise DATETIME,
sunset DATETIME
)
"""
try:
    res = engine.execute("DROP TABLE IF EXISTS weather")
    res = engine.execute(sql)
    print(res.fetchall())
except Exception as e:
    print(e)



def weather_to_db(text):
    weathers = json.loads(text)
    print(weathers)
    print(type(weathers), len(weathers))
    
   
    
    vals2 = [weathers['weather'][0]['id'],weathers['weather'][0]['main'],weathers['weather'][0]['description'],
        weathers['weather'][0]['icon'],weathers['main']['temp'],weathers['main']['humidity'],weathers['wind']['speed'],
        weathers['wind']['deg'],weathers['sys']['sunrise'],weathers['sys']['sunset']]

    vals2[8] = datetime.fromtimestamp(vals2[8])

    vals2[9] = datetime.fromtimestamp(vals2[9])
    engine.execute("insert into weather values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", vals2)




def main():
    while True:
        try:
            r = requests.get("https://api.openweathermap.org/data/2.5/weather?lat=53.3498&lon=-6.2603&appid=9846008113c7ea18f5c354bfdeef69c9")
            r.json()
            weather_to_db(r.text)
            print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            time.sleep(5*10)

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

            