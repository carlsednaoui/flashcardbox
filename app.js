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

app.get('/', function(req, res) {
  res.render('index.jade', {
    pageTitle: 'Welcome',
    questions: '[]',
    box_id: '[]'
  });
});

app.post('/new', function(req, res) {
  flashcardBox.save({
    questions: req.param('questions')
  }, function (error, questions) {
    res.redirect('/' + questions.box_id);
  });
});

app.get('/:id', function(req, res) {
  flashcardBox.findById(req.params.id + '', function(error, questions) {
    if (!error && questions) {
      res.render('index.jade', {
        pageTitle: questions.box_id,
        questions: JSON.stringify(questions.questions),
        box_id: JSON.stringify(questions.box_id)
      });
    } else {
      console.log('User tried going to a URL that does not exist: ' + req.params.id);
      res.redirect('/');
    }
  });
});

app.listen(3000);

console.log('launching server on port 3000');