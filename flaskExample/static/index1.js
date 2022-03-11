function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(53.350140, -6.266155),
        zoom: 14,
    });
    fetch("/stations").then(response => {
        return response.json();
    }).then((json) => {
        // // console.log("bike stations", json)
        // json.forEach(station => {
        //     var color = 'Blue';
        //     // console.log('HEllo')
        //     fill1 = "<option value=";
        //     fill2 = ">";
        //     let text = "<select>";

        //     // console.log(station.address);
        //     text += fill1 + fill2 + station.address;

        //     text += "</select>";
        //     document.getElementById("textbox").innerHTML = text;


        //     // console.log('station', station);
        //     circle = new google.maps.Circle({
        //         strokeColor: color,
        //         strokeOpacity: '0.8',
        //         strokeWeight: 0,
        //         fillColor: color,
        //         fillOpacity: 0.55,
        //         map,
        //         radius: 75,
        //         clickable: true,
        //         center: {
        //             lat: station.position_lat,
        //             lng: station.position_lng
        //         },
                
        //     })
        // var displayInfo = "<h3>" + station.address + "</br>" + station.position_lat + "," + station.position_lng;


        // // Generate infoWindow
        // makeClickable(map, circle, displayInfo);
        // })        

        fetch("/availability")
          .then((response) => {
            return response.json();
          }).then(data=> {
              // console.log("bike stations", json)
        json.forEach(station => {
            var color = 'Blue';
            // console.log('HEllo')
            fill1 = "<option value=";
            fill2 = ">";
            let text = "<select>";

            // console.log(station.address);
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
        var displayInfo = "<h3>" + station.address + "</br>" + station.position_lat + "," + station.position_lng;


        // Generate infoWindow
        makeClickable(map, circle, displayInfo);
        })        


        
                // console.log("data ", data);
                data.reverse()
                console.log(data[0])
                console.log("bike stations", json)

                // console.log(" json", json);

    });

});
}






function locateStations(data, map, availability, stations) {
    // data = response.json();
    console.log("this is the data", data)
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


function makeClickable(map, circle, info) {
    var infowindow = new google.maps.InfoWindow({
        content: info
    });

    google.maps.event.addListener(circle, 'click', function (ev) {
        infowindow.setPosition(circle.getCenter());
        infowindow.open(map);
    });
}
