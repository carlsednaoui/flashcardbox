var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// var MONGOLAB_URI = 'mongodb://heroku_app16837523:d1eb4d6hem1tvo0gcmj4jgl5mb@ds035498.mongolab.com:35498/heroku_app16837523';
// var mongo = require('mongodb');

// var mongoUri = process.env.MONGOLAB_URI ||
//   process.env.MONGOHQ_URL ||
//   'mongodb://localhost/mydb';

// mongo.Db.connect(mongoUri, function (err, db) {
//   db.collection('mydocs', function(er, collection) {
//     collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
//     });
//   });
// });

FlashcardBox = function(host, port) {
  this.db = new Db('flashcardbox', new Server(host, port, {auto_reconnect: true}, {}), {safe: false});
  this.db.open(function(){});
};

FlashcardBox.prototype.getCollection= function(callback) {
  this.db.collection('boxes', function(error, box_collection) {
    if( error ) callback(error);
    else callback(null, box_collection);
  });
};

FlashcardBox.prototype.findById = function(id, callback) {
  this.getCollection(function(error, box_collection) {
    if (error) callback(error);
    else {
      box_collection.findOne({box_id: id}, function(error, result) {
        if (error) callback(error);
        else callback(null, result);
      });
    }
  });
};

FlashcardBox.prototype.idExists = function(id, callback) {
  this.getCollection(function(error, box_collection) {
    if (error) callback(false);
    else {
      box_collection.findOne({box_id: id}, function(error, result) {
        if (error) callback(false);
        else callback( result ? true : false );
      });
    }
  });
};

FlashcardBox.prototype.createRandomId = function(callback) {
  var space = "abcdefghijklmnopqrstuvwxyz" +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
              "0123456789";
  var randomId = [];

  for (var i=0; i < 4; i++) {
    randomId.push(space[Math.floor(Math.random()*space.length)]);
  }

  randomId = randomId.join('');

  this.idExists(randomId, function(res) {
    if (res) {
      this.createRandomId(callback);
    } else {
      callback(randomId);
    }
  });
};



FlashcardBox.prototype.save = function(flashcards, callback) {
  var that = this;
  this.getCollection(function(error, box_collection) {
    if (error) callback(error);
    else {
      that.createRandomId(function(randomId) {
        flashcards.box_id = randomId;

        var _flashcards = [],
            qa  = flashcards.flashcards.split('\n');

        // Get rid of empty questions
        qa = qa.filter(function(card) {
           return card !== '' && card !== '\r';
         });

        qa.forEach(function(card) {
          var parsedCard = card.split(',');
          _flashcards.push({question: parsedCard[0], answer: parsedCard[1].replace('\r', '')});
        });

        flashcards.questions = _flashcards;

        box_collection.insert(flashcards, function() {
          callback(null, flashcards);
        });
      });
    }
  });
};

exports.FlashcardBox = FlashcardBox;
