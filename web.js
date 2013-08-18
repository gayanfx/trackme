var express = require('express');
var fs = require('fs');
var app = express();
var db = require("./db.js");
db.connect();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());

app.get('/', function(req, res){
    console.log('GET /')
    var str = "";
    db.fetch(function (lat, lng, ts, err) {
      if (err != null) {
        console.log(err);
      } else {
        res.render('layout', {'lat': lat, 'lng': lng, 'timestamp': ts});
      }
    });
});

app.post('/', function(req, res){
    console.dir(req.body);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
    db.insert(req.body.lat, req.body.lon, function (err, key) {
      if (err != null) {
        console.log(err);
      }
    });
});

port = 8888;
app.listen(port);
console.log('Listening at:' + port);

