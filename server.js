var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sequelize = require('sequelize');
var socket = require('socket.io');


var db = require("./models");
var PORT = 3000;

// Init App
var app = express();


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/api', require('./routes/apiRoutes'));





// Set Port
app.set('port', (process.env.PORT || 3000));

// var server = db.sequelize.sync({ force: false }).then(function() {
//   app.listen(PORT, function() {
//     console.log("App listening on PORT " + PORT);
//   });
// });

db.sequelize.sync({ force: false });
var server = app.listen(PORT, function(){
  console.log('listening')
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log(socket.id);

  socket.on('newPlayer', function(data){
    io.sockets.emit('newPlayer', data);
    console.log(data)
  });

  socket.on('newEnemy', function(data){
    io.sockets.emit('newEnemy', data);
    console.log(data);
  });

  socket.on('enemyDamage', function(data){
    io.sockets.emit('enemyDamage', data)
    console.log(data);
  });

  socket.on('playerDamage', function(data){
    io.sockets.emit('playerDamage', data)
    console.log(data);
  });
});

