var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

FlashcardBox = function(host, port) {
  this.db = new Db('flashcardbox', new Server(host, port, {auto_reconnect: true}, {}));
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



FlashcardBox.prototype.save = function(questions, callback) {
  var that = this;
  this.getCollection(function(error, box_collection) {
    if (error) callback(error);
    else {
      that.createRandomId(function(randomId) {
        questions.box_id = randomId;

        var flashcards = [],
            qa  = questions.questions.split('\n');

        // Get rid of empty questions
        qa = qa.filter(function(card) {
           return card !== '' && card !== '\r';
         });

        qa.forEach(function(card) {
          var parsedCard = card.split(',');
          flashcards.push({question: parsedCard[0], answer: parsedCard[1].replace('\r', '')});
        });

        questions.questions = flashcards;

        box_collection.insert(questions, function() {
          callback(null, questions);
        });
      });
    }
  });
};

exports.FlashcardBox = FlashcardBox;
