var MongoClient = require('mongodb').MongoClient,
    express     = require('express'),
    app         = express();

MongoClient.connect("mongodb://localhost:27017/flashcardBoxes", function(err, db) {
  if (err) return console.log(err);

  var boxes = db.collection("boxes");

  app.get('/', function(req, res) {

    boxes.find().toArray(function(err, result) {
      if (err) return console.log(err);

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', result.length);
      res.end(result.toString());
    });

  });
});

app.listen(3000);
console.log('Listening on port 3000');