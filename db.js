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

exports.get_data = function(key, cb) {
  exports.client.hgetall(key, cb);
}

exports.insert = function(lat, lng, cb) {
  exports.client.get("key", function(err, reply) {
    if (err != null) {
      cb(err, -1);
    } else {
      exports.client.incr("key");
      var key = parseInt(reply) + 1;
      var date = new Date();
      date = (date.getUTCHours() - 4) + ":" + (date.getUTCMinutes()) + ":00";
 
      exports.client.set("timestamp", date, redis.print);
      exports.client.hmset(key, "lat", lat, "lng", lng,
        function(err) {
          cb(err, key);
        }
      );
    }
  });
}

// Get the (at most) n most recent posts.
exports.fetch_recent = function(n, cb) {
  var record_list = [];

  exports.client.mget(["key", "timestamp"], function(err, reply) {
    if (err != null) {
      cb(err, reply);
    } else {
      var acc = exports.client.multi();
      var max_key = parseInt(reply[0]);
      var ts = reply[1];
      for (i = 0; i < n; i++) {
        acc = acc.hgetall(max_key - i);
      }
      acc = acc.exec(function (err, replies) {
        replies.forEach(function (reply, index) {
          if (reply != null) {
            reply['id'] = max_key - index;
          }
        });
        cb(replies.filter(function (val) { return val != null; }), ts);
      });
    }
  });
}
