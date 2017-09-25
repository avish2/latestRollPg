//var sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var db = require("../models");

// User Schema
module.exports = function(sequelize, DataTypes){
var User = sequelize.define('User', {
	username: {
		type: DataTypes.STRING,
		index:true
	},
	password: {
		type: DataTypes.STRING
	},
	email: {
		type: DataTypes.STRING
	},
	name: {
		type: DataTypes.STRING
	}
});

User.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    User.hasMany(models.Character, {
      onDelete: "cascade"
    });
  };

return User;
}



//var User = module.exports = mongoose.model('User', UserSchema);

// module.exports.createUser = function(newUser, callback){
// 	bcrypt.genSalt(10, function(err, salt) {
// 	    bcrypt.hash(newUser.password, salt, function(err, hash) {
// 	        newUser.password = hash;
// 			db.User.create(newUser);
// 			//remember you changed this to create from save
// 	    });
// 	});
// }

// module.exports.getUserByUsername = function(username, callback){
// 	var query = {username: username};
// 	User.findOne(query, callback);
// }

// module.exports.getUserById = function(id, callback){
// 	User.findById(id, callback);
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
// 	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     	if(err) throw err;
//     	callback(null, isMatch);
// 	});
// }