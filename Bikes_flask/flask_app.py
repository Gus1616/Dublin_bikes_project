
# from distutils.log import debug
from flask import Flask, render_template, g, request, jsonify, url_for, redirect
from sklearn.metrics import jaccard_score
from sqlalchemy import create_engine
import pandas as pd
# import json
import pickle
import numpy as np

# import pymysql
# pymysql.install_as_MySQLdb()
app = Flask(__name__)
model = pickle.load(open('Bikes_flask\model_stands.pkl', 'rb'))
model_bikeStands = pickle.load(open('Bikes_flask\model_stands.pkl', 'rb'))






# connect to db
URL = "dublin-bikesdb.cmd8vuwgew1e.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "admin"
PASSWORD = "Dbikes123"

engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

@app.route("/", methods=['GET', 'POST'])
def home():
    return render_template('index.html')


@app.route("/about")
def about():
    return render_template('about.html')




@app.route("/contact")
def contact():
    return render_template('contact.html')


@app.route("/stations")
def get_stations():
    engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    # query to join stations and availbility table. 
    sql_query_stations= """
        SELECT DISTINCT station.address,station.bike_stands, station.name, station.number, station.position_lat,station.position_lng,station.status, avail.available_bike_stands, avail.available_bikes, avail.last_update,station.bonus,station.banking
        FROM station, availability avail
        INNER JOIN
            (
            SELECT number, max(last_update) as last_update
            FROM availability 
            GROUP BY number
            ) select_avail
            ON avail.number = select_avail.number AND avail.last_update = select_avail.last_update
        WHERE station.number = avail.number
        ORDER BY station.name ASC;  
    
    """
    df = pd.read_sql_query(sql_query_stations, engine)
    results = df.to_json(orient='records')
    return results

@ app.route('/availability')
def get_availability():
    engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    df = pd.read_sql_table("availability", engine)
    results = df.to_json(orient='records')
    return results

@ app.route('/current_weather')
def get_weather():
    engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    sql_query_weather= """
        SELECT * FROM dbikes.weather order by sunrise desc limit 1;    """
    df = pd.read_sql_query(sql_query_weather, engine)
    # df = pd.read_sql_query("weather", engine)

    results = df.to_json(orient='records')
    return results

# Predictions
@app.route('/predict', methods=['GET','POST'])
def predict():

    
        int_features = [int(x) for x in request.form.values()]
        final_features = [np.array(int_features)]
        prediction = model.predict(final_features)

        output = round(prediction[0])
       
        return jsonify({'output':output})

# predicting bike stands
@app.route('/predict_bikestands', methods=['GET','POST'])
def predict_bikestands():

    
        int_features = [int(x) for x in request.form.values()]
        final_features = [np.array(int_features)]
        prediction = model_bikeStands.predict(final_features)

        output2 = round(prediction[0])

        return jsonify({'output2':output2})

    

if __name__== "__main__":
    app.run(debug=True)