function markPos(map, posObject) {
    const newMarker = new google.maps.Marker({
        position: {
            lat: posObject.lat,
            lng: posObject.lng
        },
        map: map,
    });
}

function calcRoute(map, origin, destination) {
    let routeData = 1
    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer;
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
}

function startMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById('map'),
        {
            zoom: 11,
            center: { lat: Number(startLatBox.value), lng: Number(startLngBox.value) }
        }
    );

    markPos(map, { lat: Number(startLatBox.value), lng: Number(startLngBox.value) })
    markPos(map, { lat: Number(endLatBox.value), lng: Number(endLngBox.value) })
    calcRoute(map,
        { lat: Number(startLatBox.value), lng: Number(startLngBox.value) },
        { lat: Number(endLatBox.value), lng: Number(endLngBox.value) })


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