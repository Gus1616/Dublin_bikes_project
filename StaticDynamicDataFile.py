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

URI = "database-1.cmd8vuwgew1e.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "admin"
PASSWORD = "Apples123"

engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URI, PORT, DB), echo=True)
sql = '''
CREATE DATABASE IF NOT EXISTS dbikes;
'''
engine.execute(sql)
for res in engine.execute("SHow Variables;"):
    print(res)

sql = """
CREATE TABLE IF NOT EXISTS station (
address VARCHAR(256),
banking INTEGER,
bike_stands INTEGER,
bonus INTEGER,
contract_name VARCHAR(256),
name VARCHAR(256),
number INTEGER,
position_lat REAL,
position_lng REAL,
status VARCHAR(256)
)
"""
try:
    res = engine.execute("DROP TABLE IF EXISTS station")
    res = engine.execute(sql)
    print(res.fetchall())
except Exception as e:
    print(e)

sql = """
CREATE TABLE IF NOT EXISTS availability (
number INTEGER,
available_bike_stands INTEGER,
available_bikes INTEGER,
status VARCHAR(256),
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






def write_to_file(text):
    with open ("data/bikes_{}".format(now).replace(" ", "_", "w")) as f:
        f.write(r.text)


def stations_to_db(text):
    stations = json.loads(text)
    print(stations)
    print(type(stations), len(stations))
    for station in stations:
        print(station)
        vals = [station.get("address"),int(station.get("banking")),
               station.get("bike_stands"),(station.get("address")),
                station.get("contract_name"),station.get("name"),
                station.get("number"),station.get("position").get("lat"),
               station.get("position").get("lng"), station.get("status")]
       
        engine.execute("insert into station values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",vals)


    return
stations_to_db(r.text)


def stations_to_db2(text):
    stations = json.loads(text)
    print(stations)
    print(type(stations), len(stations))
    for station in stations:
        print(station)

        vals2 = [station.get("number"), station.get("available_bikes"),
        station.get("available_bike_stands"), station.get("last_update")]
        timestamp = vals2[3]/1000
        vals2[3] = dt_object = datetime.datetime.fromtimestamp(timestamp)
        engine.execute("insert into availability values(%s,%s,%s,%s)", vals2)



stations_to_db2(r.text)
def main():
    while True:
        try:
            r = requests.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=0d101d6645f441b34490f9530a0f91c869debe77")
            stations_to_db2(r.text)
            print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            time.sleep(5*2)

            return
        except:
            print(traceback.format_exc())
            continue

if __name__ == '__main__':
    main()



metadata = sqla.MetaData()

