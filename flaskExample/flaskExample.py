from distutils.log import debug
from flask import Flask, render_template, g
from sqlalchemy import create_engine
from flask import jsonify
import pandas as pd
import json

app = Flask(__name__)

# connect to db
URL = "dublin-bikesdb.cmd8vuwgew1e.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "admin"
PASSWORD = "Dbikes123"

engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

@app.route("/")
def home():
    return render_template('index.html')


@app.route("/stations")
def get_stations():
    print("Calling stations")
    # engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    # sql = "select * from station;"
    df = pd.read_sql_table("station", engine)
    # rows = engine.execute(sql).fetchall()
    # print('#found {} stajtions',len(rows))
    # return jsonify(stations=[dict(row.items()) for row in rows])

    results = df.to_json(orient='records')
    # print(results)
    return results

@ app.route('/availability')
def get_availability():
    print("Calling availability")
    # engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    # sql = "select * from station;"
    df = pd.read_sql_table("availability", engine)
    # rows = engine.execute(sql).fetchall()
    # print('#found {} stajtions',len(rows))
    # return jsonify(stations=[dict(row.items()) for row in rows])

    results = df.to_json(orient='records')
    # print(results)
    return results

if __name__== "__main__":
    app.run(debug=True)