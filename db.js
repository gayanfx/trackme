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
  var date = new Date();
  date = (date.getUTCHours() - 4) + ":" + (date.getUTCMinutes()) + ":00";

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
