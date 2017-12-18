var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var cv = require('../lib/opencv');

var app = express();

app.use(express.static('js'));
app.use(express.static('frame'));
app.use(express.static('processed'));
app.use(express.static('audio'));

app.use(bodyParser.json());

let foundEyes = false;
let previousFoundEyes = false;

let time;
let previousTime = Date.now();

let tired = false;

let COLOR = [0, 255, 0];

setInterval(update, 100);

function update() {

cv.readImage('./frame/frame.jpg', function(err, im) {
  if (err) throw err;
  if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

  im.detectObject('../data/frontalEyes35x16.xml', {}, function(err, eyes) {
    if (err) throw err;

    for (var i = 0; i < eyes.length; i++) {
      var eye = eyes[i];
      im.rectangle([eye.x, eye.y], [eye.width, eye.height], COLOR, 2);
    }

    time = Date.now();

    if (eyes.length >= 1) {
      foundEyes = true;
    } else {
      foundEyes = false;
      if (previousFoundEyes === true) {
        console.log("blink!");
        console.log(time - previousTime);
        previousTime = time;
        if (time - previousTime < 1500) {
          tired = true;
        } else {
          tired = false;
        }
      }
    }
    previousFoundEyes = foundEyes;

    im.save('./processed/processed.jpg');
  });
});
}

app.post("/getStatus", function (req, res) {
    res.send(JSON.stringify({
        status: tired
      }));
});

app.post("/api/upload", function (req, res) {

    var data = req.body.photo;
    //console.log(data);

    var buf = new Buffer(data, 'base64');
    fs.writeFileSync('frame/frame.jpg', buf);

    res.send(JSON.stringify({
        status: 'ok'
      }));
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function (a) {
    console.log("Listening to port 8080");
});
