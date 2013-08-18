var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var start = "40.680873,-74.431052";
var end = "42.443961,-76.501881";

function initialize() {
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
  map = new google.maps.Map(
    document.getElementById("map-canvas"),
    mapOptions
  );
  map.fitBounds(bounds);
  directionDisplay.setMap(map);

  setTimeout(get_update, 5000);
}

function refresh_route(lat, lng) {
  var point = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({position: point, map: map});

  var request = {origin: start, destination: end,
      travelMode: google.maps.DirectionsTravelMode.DRIVING};
  directionsService.route(request, function(response, status) {
    directionDisplay.setDirections(response);
  });
  $('#loading').css('display', 'none');
}

function get_update() {
  $.ajax({
    url: '/update',
    success: function(reply) {
      refresh_route(reply.lat, reply.lng);
      $('#timestamp').html('Last updated ' + reply.timestamp);
    },
    dataType: 'json',
  });
}

$(document).ready(function() {
  initialize();

  window.setInterval(get_update, 1000 * 3);
});
