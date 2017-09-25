var express = require('express');
var router = express.Router();
var db = require("../models");
//Steve:  added lore to newCharacter variable, line 13.
//post route to create a new character
router.post('/character', function(req, res){
    var newCharacter = {
        characterName: req.body.characterName,
        class: req.body.class,
        hp: req.body.hp,
        ap: req.body.ap,
        de: req.body.de,
        weapon: req.body.weapon,
        lore: req.body.lore,
        UserId: req.user.id
    }
    db.Character.create(newCharacter);
    //redirect to new page displaying characters???
})
//returns all character created by current user
router.get('/character', function(req, res){
    db.Character.findAll({
		where:{UserId: req.user.id}
	}).then(function(characterData){
		res.json(characterData);
	});
});

//returns character that user selects to play as
router.get('/selectCharacter', function(req, res){
    db.Character.findOne({
		where:{characterName: req.body.characterName}
	}).then(function(characterData){
		res.json(characterData);
	})
})




module.exports = router;