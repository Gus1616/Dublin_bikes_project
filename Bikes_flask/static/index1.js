// elements 
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".weather-description p");
const windElement = document.querySelector(".wind-speed p");
const sunriseElement = document.querySelector(".sun-rise p");
const sunsetElement = document.querySelector(".sun-set p");




// variable to hold weather
const weather = {};
var markers = [];
// intialise the map function
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(53.350140, -6.266155),
        zoom: 14,
    });
    test1 = [];
    test2 = [];
   
// pop up window variable
    infoWindow = new google.maps.InfoWindow();

// code to get current location
  const locationButton = document.createElement("button");



  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
// NEW code to get current location for second button
const locationButton1 = document.createElement("button");
locationButton1.textContent = "Nearest location";
locationButton1.classList.add("custom-map-control-button1");
map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton1);
locationButton1.addEventListener("click", () => {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        find_closest_marker(position.coords.latitude, position.coords.longitude)
        console.log('In')
        // infoWindow.setPosition(pos);
        // infoWindow.setContent("Location found.");
        // infoWindow.open(map);
        // map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
    console.log('Ien')
  }
});

// console.log(station.banking)
//contents of the loaded in table will be stored in this string called
// text. It is initalised as blank to begin with.
  text = "";

// fetch function to get stations data 

    fetch("/stations").then(response => {
        return response.json();
    }).then((json) => {
      // looping through each station then adding data to the map
        json.forEach(station => {
          
          
          var color = 'Blue';

          if (station.available_bikes >= 0 && station.available_bikes <= 5 ){
            color = 'Red';
          }
          if (station.available_bikes >= 6 && station.available_bikes <= 15){
            color = 'Orange';
          }
          if (station.available_bikes > 15){
            color = 'Green';
          }
          test1.push(station.position_lat);
          test2.push(station.position_lng);
          // fill 1,2 and 3 along with the various other table related variables 
          // below are used in creating a string for the table once the select station 
          // button is pressed.
            fill1 = "<option value=";
            fill2 = ">";
            fill3 = "</option>";

            table = '<table id = tableinfo >';
            tableclose = "</table>";

            tablerow = '<tr >';
            tablerowclose = "</tr>";

            tabledata = '<td align="center" width= "450px"  >';
            tabledataclose = "</td >";
            tabledata_span = '<td colspan="3" align="center">'
            
            // banking and bonus are represented as 0 for no and 1 for yes .
            // these are changed into a more realable format.

            if(station.banking == "0"){station.banking = "Unavailable";}
            else if (station.banking == "1"){station.banking = "Available";}
            
            if(station.bonus == "0"){station.bonus = "Unavailable";}
            else if (station.bonus == "1"){station.bonus = "Available";}
            station.address = station.address.replaceAll("'","");
            // the below code is used to turn the time of last update from 
            // a timestamp into a more readable format.
            var date = new Date(station.last_update);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            

            //  a string is created to put the required information alongside 
            // the table variables so that it can be converted into a string which 
            // is read as html code to display the table .


            content_of_table =("'" + table + 
            tablerow + 
            tabledata + "Station Address" + tabledataclose +  
            tabledata + "Station Status"  + tabledataclose +  
            tablerowclose + 

            tablerow + 
            tabledata + station.address + tabledataclose +  
            tabledata + station.status  + tabledataclose +  
            tablerowclose +

            tablerow + 
            tabledata_span + "Location" + tabledataclose +   
            tablerowclose + 

            tablerow + 
            tabledata + station.position_lat +tabledataclose + 
            tabledata + station.position_lng + tabledataclose + 
            tablerowclose + 

            tablerow + 
            tabledata + "Available Bikes" + tabledataclose + 
            tabledata + "Available Bike Stands" + tabledataclose +  
            tablerowclose + 

            tablerow + 
            tabledata + station.available_bikes + tabledataclose + 
            tabledata + station.available_bike_stands + tabledataclose +  
            tablerowclose + 

            tablerow + 
            tabledata + "Banking" + tabledataclose + 
            tabledata + "Bonus" + tabledataclose + 
            tablerowclose +


            tablerow + 
            tabledata + station.banking + tabledataclose + 
            tabledata + station.bonus + tabledataclose + 
            tablerowclose +

            tablerow + 
            tabledata_span + "Last Updated"+ tabledataclose + 
            tablerowclose +

            tablerow + 
            tabledata_span + formattedTime + tabledataclose + 
            tablerowclose + tableclose + "'" );
            
              
          
  
             // the blank string text is filled with the required information
            // along with fill variables which represent the option html tag.
            // the textbox div is then populated with this string.
            text +=  fill1 + content_of_table + fill2 + station.address + fill3;
            document.getElementById("textbox").innerHTML = text;


            index_start = (document.getElementsByTagName("option")[0].value);
            document.getElementById("Table_station").innerHTML = index_start;

            
          


            // drop that is used for predictions:
            let stationDropdown = "<option value=\"" + station.number + "\">" + station.address + "</option>";
            document.getElementById("begin").innerHTML += stationDropdown;
            document.getElementById("endJourney").innerHTML += stationDropdown;


            

            // console.log('station', station);
            circle = new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: '0.8',
                strokeWeight: 0,
                fillColor: color,
                fillOpacity: 0.55,
                map,
                radius: 75,
                clickable: true,
                center: {
                    lat: station.position_lat,
                    lng: station.position_lng
                },
                
            })
        var displayInfo = "<h3>" + station.address + "</br>" + "</h3>Bikes Available : " + station.available_bikes + "</br>Bike Stands Free : " + station.available_bike_stands;


        // Generate infoWindow
        makeClickable(map, circle, displayInfo);
        })        

        fetch("/current_weather")
          .then((response) => {
            return response.json();
          }).then(function (data) {
            
    });

});
}



// This function is used to display the table of information when a station 
// is selected. It is activated on the click of the select station button.
function table_populate() {

  // this code allows for the table to be updated with the correct information
// based on which station is selected and is displayed in the table station div.

  var indexselect = document.getElementById("textbox").selectedIndex;
  index = (document.getElementsByTagName("option")[indexselect].value);
  document.getElementById("Table_station").innerHTML = index;

  // all floats from the data provided are found by filtering out anything that
  // is not a number.

  var indexselected_ints = index.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
  
  // the audio mp3 file is played also on the click of the station button.
  var audio = document.getElementById("audio");
  audio.play();

// all floats from the table information and listed in indexselected_ints 
// the firts of these is the stations latitude and the second is its longitude.
// these are used to create a marker on the map.
  var selected_station_lat = parseFloat(indexselected_ints[0]);
  var selected_station_lng = (parseFloat(indexselected_ints[1])*-1);
  
  // each time a new station is clicked or if the nearest staion is 
  // selected all prior markers are removed before the new marker is placed. THese 
  // are pushed to the markers array.

  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
}
markers = [];

  marker = new google.maps.Marker({
    map: map,
    position: {
      lat: (selected_station_lat),
      lng: (selected_station_lng)
    },
  
  });
  marker_position = new google.maps.LatLng(selected_station_lat, selected_station_lng);
  map.setCenter(marker_position);
markers.push(marker)
}



function makeClickable(map, circle, info) {
  console.log('In the make clickable')
    var infowindow = new google.maps.InfoWindow({
        content: info
    });

    google.maps.event.addListener(circle, 'click', function (ev) {
        infowindow.setPosition(circle.getCenter());
        infowindow.open(map);
    });
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

 // fetching the current weather 
  fetch("/current_weather")
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
      // assigning variable to the necessary objects in the JSON 
          weather.temperature = Math.floor(data[0].temperature- 273);
          weather.description = data[0].description1;
          weather.iconId = data[0].icon;
          weather.windspeed = data[0].windspeed;
          weather.sunrise = new Date(data[0].sunrise); 
          weather.sunset = new Date(data[0].sunset);
         


          console.log("sun rise: ", weather.sunrise)



  })
  .then(function(){
    // function to display the weather
    displayWeather();
  
});


function stripSunrise(sunrise){
  return sunrise.slice(0,25);

}



// function to pass through the JSON as readable HTML objects. 
function displayWeather(){
  iconElement.innerHTML = `<img src="http://openweathermap.org/img/w/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature}°<span>C</span>`;
  descElement.innerHTML = `<span>Current Description: </span>${weather.description }<span></span>`;
  windElement.innerHTML = `<span>Wind: </span>${weather.windspeed }<span>Km/h</span>`;
  sunriseElement.innerHTML = `<span>Sun Rise Today: </span>${weather.sunrise}<span></span>`;
  sunsetElement.innerHTML = `<span>Sun Set Today: </span>${weather.sunset}<span></span>`;

}
function find_closest_marker(lat1, lon1) {    
  var pi = Math.PI;
  var R = 6371; //equatorial radius
  var distances = [];
  var closest = -1;

  for( i=0;i<110; i++ ) {  
      console.log(test1[i])
      console.log(test2[i])
      var lat2 = test1[i];
      var lon2 = test2[i];

      var chLat = lat2-lat1;
      var chLon = lon2-lon1;

      var dLat = chLat*(pi/180);
      var dLon = chLon*(pi/180);

      var rLat1 = lat1*(pi/180);
      var rLat2 = lat2*(pi/180);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;

      distances[i] = d;
      if ( closest == -1 || d < distances[closest] ) {
          closest = i;
      }
  }

  // (debug) The closest marker is:
  console.log('Please work')
  console.log(test1[closest]);
  console.log(test2[closest]);
  var center = new google.maps.LatLng(test1[closest], test2[closest]);
  // using global variable:
  window.map.panTo(center);  
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
}
  
  markers = [];
  
  circle = new google.maps.Marker({
    map: map,
    clickable: true,
    position: {
        lat: test1[closest],
        lng: test2[closest]
    }
    
})
marker_position = new google.maps.LatLng(test1[closest], test2[closest]);
map.setCenter(marker_position);
markers.push(circle)
}

// Loading screen -  reference https://www.youtube.com/watch?v=MOlaldp1Fv4
const spalsh = document.querySelector('.splash');
document.addEventListener('DOMContentLoaded', (e)=>{
  setTimeout(()=>{
    spalsh.classList.add('display-none');
}, 3000);

})


$(document).ready(function() {

	$('form').on('submit', function(event) {

		$.ajax({
			data : {
				day : $('#daySelect').val(),
        hour : $('#hourSelect').val(),
        station : $('#begin').val(),

			},
			type : 'POST',
			url : 'predict'
		})
		.done(function(data) {

			
				$('#predictionResult').text("Number of predicted bikes avaiable: " + data.output).show();
			
			

		});

		event.preventDefault();

	});

});
        


$(document).ready(function() {

	$('form').on('submit', function(event) {

		$.ajax({
			data : {
				day2 : $('#daySelect2').val(),
        hour2 : $('#hourSelect2').val(),
        station2 : $('#endJourney').val(),

			},
			type : 'POST',
			url : '/predict_bikestands'
		})
		.done(function(data) {

			
				$('#predictionResult2').text("Number of predicted bikes stands avaiable: " + data.output2).show();
			
			

		});

		event.preventDefault();

	});

});
   



function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}





  

 
