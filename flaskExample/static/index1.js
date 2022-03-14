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
      appendData(data);
      console.log(data)
  })
  .catch(function (err) {
      console.log('error: ' + err);
  });
function appendData(data) {
  var mainContainer = document.getElementById("myData");
  console.log("data lenght ", data.length)
  // for (var i = 0; i < data.length;i++) 
  var div = document.createElement("div");
  div.innerHTML = 'Description: ' + data[0].description1 + '</br>' + 'temp: '+data[0].temperature+ '</br>' + 'Wind Speed: '+data[0].windspeed;
  mainContainer.appendChild(div);
  
}



  

 
