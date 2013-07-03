var MongoClient = require('mongodb').MongoClient,
    express     = require('express'),
    app         = express();

MongoClient.connect("mongodb://localhost:27017/flashcardBoxes", function(err, db) {
  if (err) return console.log(err);

  var boxes = db.collection("boxes");
  boxes.find().toArray(function(err, boxes) {
    if (err) return console.log(err);

    console.log(boxes);
  });
});

app.get('/', function(req, res) {
  var body = 'Hello World';

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.listen(3000);
console.log('Listening on port 3000');