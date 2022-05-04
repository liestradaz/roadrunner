const directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

function markPos(map, startPos, endPos) {
    const startPosMarker = new google.maps.Marker({
        position: {
            lat: startPos.lat,
            lng: startPos.lng
        },
        map: map,
        draggable: true
    });

    const endPosMarker = new google.maps.Marker({
        position: {
            lat: endPos.lat,
            lng: endPos.lng
        },
        map: map,
        draggable: true
    });

    google.maps.event.addListener(startPosMarker, 'dragend', function (event) {
        startLatBox.value = event.latLng.lat()
        startLngBox.value = event.latLng.lng()

        directionsDisplay.setDirections({routes: []})
        calcRoute(map,
            { lat: Number(startLatBox.value), lng: Number(startLngBox.value) },
            { lat: Number(endLatBox.value), lng: Number(endLngBox.value) })
            .then(data => distanceBox.value = data.distance.text)
          .catch(error => console.log(error))
    });

    google.maps.event.addListener(endPosMarker, 'dragend', function (event) {
        endLatBox.value = event.latLng.lat()
        endLngBox.value = event.latLng.lng()
      
        calcRoute(map,
            { lat: Number(startLatBox.value), lng: Number(startLngBox.value) },
            { lat: Number(endLatBox.value), lng: Number(endLngBox.value) })
            .then(data => distanceBox.value = data.distance.text)
          .catch(error => console.log(error))
    });
}

/* function calcRoute(map, origin, destination) {
    let routeData = 1
    const directionsService = new google.maps.DirectionsService;
    //const directionsDisplay = new google.maps.DirectionsRenderer;
    const directionRequest = {
        origin: origin,
        destination: destination,
        //travelMode	string as DRIVING, BICYCLING, TRANSIT, WALKING
        travelMode: 'WALKING'
    };

    directionsService.route(
        directionRequest,
        function (response, status) {
            if (status === 'OK') {
                // everything is ok
                directionsDisplay.setDirections(response);
                this.routeData = response.routes[0].legs[0]
            } else {
                // something went wrong
                window.alert('Directions request failed due to ' + status);
            }
        }
    );

    directionsDisplay.setMap(map);

    return directionsDisplay
} */

function calcRoute(map, origin, destination) {
    const directionsService = new google.maps.DirectionsService;
    const directionRequest = {
      origin: origin,
      destination: destination,
      //travelMode	string as DRIVING, BICYCLING, TRANSIT, WALKING
      travelMode: 'WALKING'
    };
  
    return new Promise((resolve,reject)=>{
      directionsService.route(
        directionRequest,
        function (response, status) {
          if (status === 'OK') {
            // everything is ok
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
            resolve(response.routes[0].legs[0])
    
          } else {
            // something went wrong
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    })
  }


function startMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById('map'),
        {
            zoom: 11,
            center: { lat: Number(startLatBox.value), lng: Number(startLngBox.value) }
        }
    );

    markPos(map, 
        { lat: Number(startLatBox.value), lng: Number(startLngBox.value) },
        { lat: Number(endLatBox.value), lng: Number(endLngBox.value) })

    //markPos(map, { lat: Number(endLatBox.value), lng: Number(endLngBox.value) })
    calcRoute(map,
        { lat: Number(startLatBox.value), lng: Number(startLngBox.value) },
        { lat: Number(endLatBox.value), lng: Number(endLngBox.value) }) 
        .then(data => distanceBox.value = data.distance.text)
          .catch(error => console.log(error))


    return map
}

window.onload = function () {
    startLatBox = document.getElementById("startlat")
    startLngBox = document.getElementById("startlng")
    endLatBox = document.getElementById("endlat")
    endLngBox = document.getElementById("endlng")
    distanceBox = document.getElementById("distancebox")
    startMap();

} 