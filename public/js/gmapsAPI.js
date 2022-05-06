const directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

 function markPos(map, posObject){
    const newMarker = new google.maps.Marker({
        position: {
            lat: posObject.lat,
            lng: posObject.lng
          },
        map: map,
        //title: "You are here."
        draggable: true
      });
      google.maps.event.addListener(newMarker,'drag',function(event) {
        startLatBox.value = event.latLng.lat()
      });
} 


function getUserLocation(map){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const user_location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
    
          // Center map with user location
          map.setCenter(user_location);
          
          const img = "../images/street-view-48.png"
          // Add a marker for your user location
          const ironhackBCNMarker = new google.maps.Marker({
            position: {
              lat: user_location.lat,
              lng: user_location.lng
            },
            map: map,
            icon: img
            
          });
    
        }, function () {
          console.log('Error in the geolocation service.');
        });
      } else {
        console.log('Browser does not support geolocation.');
      }
}

//promise
function calcRoute(map, origin, destination) {
  let routeData = 1
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
          this.routeData = response.routes[0].legs[0]
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

function locateAddress(map){
    const geocoder = new google.maps.Geocoder();

      const address = document.getElementById('address').value;
       
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            let marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
            console.log("latitude: ",results[0].geometry.location.lat())
            console.log("longitude: ",results[0].geometry.location.lng())
          } else {
            console.log(`Geocode was not successful for the following reason: ${status}`);
          }
        });
      

}

function getMapImage(startPos, endPos) {
    baseUrl = "https://maps.googleapis.com/maps/api/staticmap?"
    size = "&size=600x400"
    markers = "markers=color:red%7C"
    options = "&zoom=12&size=600x400&key="+ process.env.GoogleAPI_key

    url = baseUrl + markers + startPos.lat + "," + startPos.lng + "%7C" + endPos.lat + "," + endPos.lng + options

    return url
}

function startMap() {
  // Initialize the map
  const ironhackMexico = {
    lat: 19.421250608923003,
    lng: -99.16329503059387
  }
  const map = new google.maps.Map(document.getElementById('map'),
    {
      zoom: 19,
      center: ironhackMexico
    }
  );

  getUserLocation(map)
  //calcRoute(map)

  // Configure the click listener.
  let clickCounter = 0
  let startPos
  let endPos
  map.addListener("click", (mapsMouseEvent) => {

    if (clickCounter == 0) {

      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      startPos = mapsMouseEvent.latLng.toJSON()
      markPos(map, mapsMouseEvent.latLng.toJSON())
      startLatBox.value = startPos.lat
      startLngBox.value = startPos.lng

    } else if (clickCounter == 1) {
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      endPos = mapsMouseEvent.latLng.toJSON()
      markPos(map, mapsMouseEvent.latLng.toJSON())
      endLatBox.value = endPos.lat
      endLngBox.value = endPos.lng

      let rData
      calcRoute(map, startPos, endPos)
        .then(data => {
          rData = data
          distanceBox.value = data.distance.text
          return data
        })
        .catch(error => console.log(error))
    } else {
        clickCounter = 0
    }
    clickCounter++

  });


  return map
}

window.onload = function(){
  startLatBox = document.getElementById("startlat")
  startLngBox = document.getElementById("startlng")
  endLatBox = document.getElementById("endlat")
  endLngBox = document.getElementById("endlng")
  distanceBox = document.getElementById("distancebox")
  startMap();
  

}