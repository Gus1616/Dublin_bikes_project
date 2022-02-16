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

URI = "dbikes2.cmd8vuwgew1e.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "admin"
PASSWORD = "Dublin123"

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

import traceback
import datetime
import time


def write_to_file(text):
    with open ("data/bikes_{}".format(now).replace(" ", "_", "w")) as f:
        f.write(r.text)

# def write_to_db(text):
#     stations = json.loads(text)
#     for station in stations:
#         vals = [station.get("number"), station.get("available_bikes"),
#                 station.get("available_bike_stands"), station.get("last_update")]
#         engine.execute("insert into availability values(%s,%s,%s,%s)", vals)

    
#     return

# def main():
#     while True:
#         try:
# #                 now = datetime.datetime.now()
#             r = requests.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=0d101d6645f441b34490f9530a0f91c869debe77")
# #                 print(r,now)
# #                 write_to_file(r.text)
#             write_to_db(r.text)
#             time.sleep(5*60)
#         except:
#             print(traceback.format_exc())
#             continue
# #                 if engine is None:
#     return

# if __name__ == '__main__':
#     main()


def stations_to_db(text):
    stations = json.loads(text)
    print(stations)
    print(type(stations), len(stations))
    for station in stations:
        print(station)
        vals = (station.get("address"),int(station.get("banking")),
               station.get("bike_stands"),(station.get("address")),
                station.get("contract_name"),station.get("name"),
                station.get("number"),station.get("position").get("lat"),
               station.get("position").get("lng"), station.get("status")
               )
        engine.execute("insert into station values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",vals)
#         break
    return
stations_to_db(r.text)

metadata = sqla.MetaData()
# station = sqla.Table("station", metadata,
# sqla.Column('address',sqla.String(256), nullable=False),
# sqla.Column('banking', sqla.INTEGER),
# sqla.Column('bike_stands', sqla.INTEGER),
# sqla.Column('bonus', sqla.INTEGER),
# sqla.Column('contract_name', sqla.String(256)),
# sqla.Column('number', sqla.INTEGER),
# sqla.Column('position_lat', sqla.REAL),
# sqla.Column('position_lng', sqla.REAL),
# sqla.Column('status', sqla.String(256))

# )

# availability = sqla.Table("availability",metadata,
# sqla.Column('available_bikes', sqla.Integer),
# sqla.Column('available_bikes_stands', sqla.Integer),
# sqla.Column('number', sqla.Integer),
# sqla.Column('last_update', sqla.TIME)

# )

# try:
#     station.drop(engine)
#     availability.drop(engine)
# except:
#     pass

# metadata.create_all(engine)


# metadata = sqla.MetaData(bind=engine)
# print(metadata)
# station = sqla.Table('station', metadata, autoload=True)
# print(station)
