var express = require('express');
var fs = require('fs');
var app = express();
var db = require("./db.js");
db.connect();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyParser());
app.use(express.static(__dirname + '/static'));
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
  console.log('GET /');
  res.render('layout', {});
});

app.get('/update', function(req, res) {
  console.log('GET /update');
  db.fetch(function(lat, lng, ts, err) {
    if (err != null) {
      console.log(err);
    } else {
      var data = {'lat': lat, 'lng': lng, 'timestamp': ts};
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(JSON.stringify(data));
      res.end();
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

