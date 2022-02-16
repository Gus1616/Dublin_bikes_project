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
import traceback
import datetime
import time


URI = "dbikes2.cmd8vuwgew1e.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "admin"
PASSWORD = "Dublin123"


engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URI, PORT, DB), echo=True)


def write_to_file(text):
    with open ("data/bikes_{}".format(now).replace(" ", "_", "w")) as f:
        f.write(r.text)

def write_to_db(text):
    stations = json.loads(text)
    for station in stations:
        vals = [station.get("number"), station.get("available_bikes"),
                station.get("available_bike_stands"), station.get("last_update")]
        engine.execute("insert into availability values(%s,%s,%s,%s)", vals)

    
    return

def main():
    while True:
        try:
#                 now = datetime.datetime.now()
            r = requests.get("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=0d101d6645f441b34490f9530a0f91c869debe77")
#                 print(r,now)
#                 write_to_file(r.text)
            write_to_db(r.text)
            time.sleep(5*60)
        except:
            print(traceback.format_exc())
            continue
#                 if engine is None:
    return

if __name__ == '__main__':
    main()
