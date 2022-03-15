// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".weather-description p");
const windElement = document.querySelector(".wind-speed p");




const weather = {};

console.log("weatherr", weather)
console.log("weatherrrrrr", iconElement)





function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(53.350140, -6.266155),
        zoom: 14,
    });

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



    fetch("/stations").then(response => {
        return response.json();
    }).then((json) => {
        json.forEach(station => {
            var color = 'Blue';
            // console.log('HEllo')
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
            // console.log("here is the weather", data)
            // appendData(data);
            // for (var i = 0; i < data.length; i++) {
            //   console.log(i)
            // }
            
              

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

  fetch("/current_weather")
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
      // appendData(data);
      // console.log(data)
      // var mainContainer = document.getElementById("weatherTemp");
      // var div = document.createElement("div");
      // div.innerHTML = data[0].temperature;
      // mainContainer.appendChild(div);

      

      // var descriptionContainer = document.getElementById("description");
      // var descriptionDiv = document.createElement("descriptionDiv");
      // descriptionDiv.innerHTML = data[0].description1;
      // descriptionContainer.appendChild(descriptionDiv);

          weather.temperature = Math.floor(data[0].temperature- 273);
          weather.description = data[0].description1;
          weather.iconId = data[0].icon;
          weather.windspeed = data[0].windspeed;
          console.log("hello", weather.temperature)
          console.log("helllllo", weather.description)



  })
  .then(function(){
    displayWeather();
  
});



function displayWeather(){
  iconElement.innerHTML = `<img src="http://openweathermap.org/img/w/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature}°<span>C</span>`;
  descElement.innerHTML = `<span>Current Description: </span>${weather.description }<span></span>`;
  windElement.innerHTML = `<span>Wind: </span>${weather.windspeed }<span>Km/h</span>`;
}






  

 
