function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(53.350140, -6.266155),
        zoom: 14,
    });

}

var url = "https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=0d101d6645f441b34490f9530a0f91c869debe77"
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        // Parse the JSON response
        data = JSON.parse(xmlhttp.responseText);

        for (i = 0; i < 101; i++) {

            var color = 'Blue';
            
            
            console.log('HEllo')
            fill1 = "<option value=";
            fill2 = ">";
            let text = "<select>";

            console.log(data[i].address);
            text += fill1 + fill2 + data[i].address;

            text += "</select>";
            document.getElementById("textbox").innerHTML = text;

            // Properties for map circles
            circle = new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: '0.8',
                strokeWeight: 0,
                fillColor: color,
                fillOpacity: 0.55,
                map: map,
                radius: 75,
                clickable: true,
                center: {
                    lat: data[i].position.lat,
                    lng: data[i].position.lng
                },
            });

            
            var displayInfo = "<h3>" + data[i].address + "</h3>Bikes Available : " + data[i].available_bikes + "</br>Bike Stands Free : " + data[i].available_bike_stands + "</br>" + data[i].position.lat + "," + data[i].position.lng;


            // Generate infoWindow
            makeClickable(map, circle, displayInfo);
        }
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function makeClickable(map, circle, info) {
    var infowindow = new google.maps.InfoWindow({
        content: info
    });

    google.maps.event.addListener(circle, 'click', function (ev) {
        infowindow.setPosition(circle.getCenter());
        infowindow.open(map);
    });
}
