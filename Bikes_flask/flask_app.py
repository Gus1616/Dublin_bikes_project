
from flask import Flask, render_template, g, request, jsonify, url_for, redirect
from sklearn.metrics import jaccard_score
from sqlalchemy import create_engine
import pandas as pd
import json
import pickle
import numpy as np

# import pymysql
# pymysql.install_as_MySQLdb()
app = Flask(__name__)
# model = pickle.load(open('flaskExample\model.pkl', 'rb'))
# model_bikeStands = pickle.load(open('Bikes_flask\model_stands.pkl', 'rb'))



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
        FROM station, availability_app avail
        INNER JOIN
            (
            SELECT number, max(last_update) as last_update
            FROM availability_app 
            GROUP BY number
            ) select_avail
            ON avail.number = select_avail.number AND avail.last_update = select_avail.last_update
        WHERE station.number = avail.number
        ORDER BY station.name ASC;  
    
    """
    df = pd.read_sql_query(sql_query_stations, engine)
    results = df.to_json(orient='records')
    return results

@ app.route('/availability_app')
def get_availability():
    engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    df = pd.read_sql_table("availability_app", engine)
    results = df.to_json(orient='records')
    return results


@ app.route('/availability')
def get_availability2():
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


@app.route("/occupancy/<int:station_id>")
def get_occupancy(station_id):
    engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    df = pd.read_sql_query("select * from availability where number = %(number)s", engine, params={"number":station_id})
    df['last_update_date'] = pd.to_datetime(df.last_update, unit='ms')
    df.set_index('last_update_date', inplace=True)
    res = df['available_bike_stands'].resample('1d').mean()
    #res['dt'] = df.index
    print(res)
    return jsonify(data=json.dumps(list(zip(map(lambda x: x.isoformat(), res.index), res.values))))
 
@app.route("/available/<currentStation>")
def getDayData(currentStation):
    ''' Function returns data from the dynamic table, which will be used to create the daily charts on our app'''
    # create a connection to our database
    engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    
    dayData = []  
    
    conn = engine.connect()
    
    # for each day of the week...
    for i in range (0,7):
        
        # SQL query returns average available bikes for a given day and station number
        string = "SELECT AVG(available_bikes) FROM availability WHERE number = {} AND WEEKDAY(last_update)= {};".format(currentStation,i)
        rows = conn.execute(string)
        
        for row in rows:
            dayData.append(dict(row))
    
    # jsonify the array 
    return jsonify(dayData)



@app.route("/available/hourly/<currentStation>/<day>")
def getHourlyData(currentStation, day):
    engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    
    hourlyData = []
    
    conn = engine.connect()
    
    # for every hour of the day between 5am and 11pm (thats when the stations are open)
    for i in range (5,24):
        
        # SQL query returns average available bikes for a given hour in a day and station number
        string = "SELECT AVG(available_bikes) FROM availability WHERE number =  {} AND EXTRACT(HOUR FROM last_update) = {} AND WEEKDAY(last_update)= {};".format(currentStation,i,day)
        rows = conn.execute(string)
        
        for row in rows:
            hourlyData.append(dict(row))
    
    # jsonify the array       
    return jsonify(hourlyData)




if __name__== "__main__":
    app.run(debug=True)