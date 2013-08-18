var directionDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize(lat, lng) {
  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(40.862585,-76.79441),
    new google.maps.LatLng(42.622024,-73.832623)
  );
  directionDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(40.07304, -74.724323),
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(
    document.getElementById("map-canvas"),
    mapOptions
  );
  map.fitBounds(bounds);
  directionDisplay.setMap(map);
  var point = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({position: point, map: map});
  var start = "40.680873,-74.431052";
  var end = "42.443961,-76.501881";
  var request = {origin: start, destination: end,
      travelMode: google.maps.DirectionsTravelMode.DRIVING};
  directionsService.route(request, function(response, status) {
    directionDisplay.setDirections(response);
  });
}
