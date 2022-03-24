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
//aaaaaaaaaaaaa
  text = "";
// fetch function to get stations data 

    fetch("/stations").then(response => {
        return response.json();
    }).then((json) => {
      // looping through each station then adding data to the map
        json.forEach(station => {
            var color = 'Blue';
            // aaaaaaaaaaaaaaaaaaaaa
            fill1 = "<option value=";
            fill2 = ">";
            fill3 = "</option>";

            table = "<table id = tableinfo>";
            tableclose = "</table>";

            tablerow = "<tr>";
            tablerowclose = "</tr>";

            tabledata = "<td>";
            tabledataclose = "</td>";
            
            
            if(station.banking == "0"){station.banking = "Unavailable";}
            else if (station.banking == "1"){station.banking = "Available";}
            
            if(station.bonus == "0"){station.bonus = "Unavailable";}
            else if (station.bonus == "1"){station.bonus = "Available";}
            station.address = station.address.replaceAll("'","");
            
            var date = new Date(station.last_update);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            
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
            tabledata + "Location" + tabledataclose +   
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
            tabledata + "Last Updated"+ tabledataclose + 
            tablerowclose +

            tablerow + 
            tabledata + formattedTime + tabledataclose + 
            tablerowclose + tableclose + "'" );
            
              
          
  
            // console.log(station);
            text +=  fill1 + content_of_table + fill2 + station.address + fill3;
            document.getElementById("textbox").innerHTML = text;
            

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
        var displayInfo = "<h3>" + station.address + "</br>" + station.position_lat + "," + station.position_lng +"</br>"+"</h3>Bikes Available : " + station.available_bikes + "</br>Bike Stands Free : " + station.available_bike_stands;


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
// aaaaaaaaaa
function myFunction() {
  var indexselect = document.getElementById("textbox").selectedIndex;
  aaa = (document.getElementsByTagName("option")[indexselect].value);
  document.getElementById("abcd").innerHTML = aaa;
  var indexselected_ints = aaa.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
  var audio = document.getElementById("audio");
  audio.play();

  var selected_station_lat = parseFloat(indexselected_ints[0]);
  var selected_station_lng = (parseFloat(indexselected_ints[1])*-1);
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






// Loading screen -  reference https://www.youtube.com/watch?v=MOlaldp1Fv4
const spalsh = document.querySelector('.splash');
document.addEventListener('DOMContentLoaded', (e)=>{
  setTimeout(()=>{
    spalsh.classList.add('display-none');
}, 3000);

})








  

 
