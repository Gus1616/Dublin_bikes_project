from flask import Flask, render_template, g
from sqlalchemy import create_engine
from flask import jsonify
import pandas as pd
import json

app = Flask(__name__)

# connect to db
URL = "database-1.cmd8vuwgew1e.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "admin"
PASSWORD = "Apples123"

engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

@app.route("/")
def home():
    return render_template('index.html')


# @app.route("/")
# def get_stations():
#     engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
#     sql = "select * from station;"
#     rows = engine.execute(sql).fetchall()
#     print('#found {} stations',len(rows))
#     # return jsonify(stations=[dict(row.items()) for row in rows])
#     df = pd.read_sql_table('station', engine)

#     results = df.to_json(orient='records')
#     print(results)
#     return results

# print(get_stations())

if __name__== "__main__":
    app.run()