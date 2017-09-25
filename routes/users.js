var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var db = require("../models");

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = {
			username: username,
			password: password,
			email:email,
			name: name
	
		};
		console.log(newUser)
		//creates user (duh..)
		createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

//login route
router.post('/login',
passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
function(req, res) {
	res.redirect('/');
});

router.get('/logout', function(req, res){
req.logout();

req.flash('success_msg', 'You are logged out');

res.redirect('/users/login');
});


// Use local strategy to create and validate user account
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.find({ where: { username: username }}).then(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (!user.password === password)	 {
        done(null, false, { message: 'Invalid password'});
      } else {
        done(null, user);
      }
    }).error(function(err){
      done(err);
    });
  }
));



// Serialize sessions
passport.serializeUser(function(user, done) {
	var sessionUser = {id:user.id, name: user.name, email: user.email}
  done(null, sessionUser);
});

passport.deserializeUser(function(sessionUser, done) {
  // db.User.find({where: {id: id}}).then(function(user){
  //   done(null, sessionUser);
  // }).error(function(err){
  //   done(err, null);
	// });
	done(null, sessionUser);

});



function createUser(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newUser.password, salt, function(err, hash) {
					newUser.password = hash;
			db.User.create(newUser);
			//remember you changed this to create from save
			});
	})
}

//cant remember if im using these. dont delete!!!
//local strategy functions consider moving to modles
function getUserByUsername(username, callback){
	db.User.find({where:{username:username}}, callback);
	
}

function getUserById(id, callback){
	console.log('getting password')
	db.User.findById({where:{id:id}}, callback);
}

function comparePassword(candidatePassword, hash, callback){
	console.log('comparing password')
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports = router;