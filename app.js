// Module dependencies
var express = require('express'),
    app     = express(),
    http    = require('http'),
    path    = require('path');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
  app.set('view engine', 'jade');
  app.use(express.static(path.join(__dirname, 'public')));
});

var FlashcardBox = require('./flashcardbox').FlashcardBox;
var flashcardBox = new FlashcardBox('localhost', 27017);

// var MONGOLAB_URI = 'mongodb://heroku_app16837523:d1eb4d6hem1tvo0gcmj4jgl5mb@ds035498.mongolab.com:35498/heroku_app16837523';
// var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/flashcardbox';
// var flashcardBox = new FlashcardBox(mongoUri);

app.get('/', function(req, res) {
  res.render('index.jade', {
    pageTitle: 'Welcome',
    questions: '[]',
    box_id: '[]'
  });
});

app.post('/new', function(req, res) {
  flashcardBox.save({
    flashcards: req.param('flashcards')
  }, function (error, flashcards) {
    res.redirect('/' + flashcards.box_id);
  });
});

app.get('/:id', function(req, res) {
  flashcardBox.findById(req.params.id + '', function(error, flashcards) {
    if (!error && flashcards) {
      res.render('index.jade', {
        pageTitle: flashcards.box_id,
        questions: JSON.stringify(flashcards.questions),
        box_id: JSON.stringify(flashcards.box_id)
      });
    } else {
      console.log('User tried going to a URL that does not exist: ' + req.params.id);
      res.redirect('/');
    }
  });
});

app.listen(3000);

console.log('launching server on port 3000');