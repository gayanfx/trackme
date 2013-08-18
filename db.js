var redis = require("redis");

// Configure the redis client, authenticating if necessary.
exports.connect = function() {
  if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
    exports.client = client;
  } else {
    exports.client = redis.createClient();
  }
}

exports.insert = function(lat, lng, cb) {
  var datestr = new Date().toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
    .split(' ');
  var time = datestr[1].split(':');
  var hour = parseInt(time[0] - 4); // Convert from UTC to EST.
  var date = hour.toString() + ":" + time[1];
  if (hour >= 12) {
    date += " PM";
  } else {
    date += " AM";
  }

  var data = [
    "timestamp", date,
    "lat", lat,
    "lng", lng
  ];

  exports.client.mset(data, cb);
}

exports.fetch = function(cb) {
  exports.client.mget(["lat", "lng", "timestamp"], function(err, reply) {
    cb(reply[0], reply[1], reply[2]);
  });
}
