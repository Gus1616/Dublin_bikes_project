// elements 
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".weather-description p");
const windElement = document.querySelector(".wind-speed p");
const sunriseElement = document.querySelector(".sun-rise p");
const sunsetElement = document.querySelector(".sun-set p");




// variable to hold weather
const weather = {};

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


// fetch function to get stations data 

    fetch("/stations").then(response => {
        return response.json();
    }).then((json) => {
      // looping through each station then adding data to the map
        json.forEach(station => {
            var color = 'Blue';
            fill1 = "<option value=";
            fill2 = ">";
            let text = "<select>";

            // console.log(station);
            text += fill1 + fill2 + station.address;

            text += "</select>";
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





// ATTEMPT AT LOADING SCREEN 
// $(function(){
//   setTimeout(function() {
//      $('#loading').fadeOut(500);
//   }, 2000);
// });








  

 
