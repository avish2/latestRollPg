$(document).ready(function(){

makeCharacterButtons();
$(document).on('click', '.characterSelector', selectCharacter );
//end of ready function
});

var characters;
var sessionCharacter;

//this function retrieves and displays the characters that the user has already created, 
//the users created characters are stored in the characters array (global variable defined above)
//each btn has a data value that acts as the index of the characters array
function makeCharacterButtons(){
    var characterHolder = $('#characterDisplay')
    
    //gets character data
    $.get('/api/character', function(data){
        characters = data
        console.log(characters);
    }).then(function(){

    //makes character buttons
    characters.forEach(function(character, index) {
        //console.log(character.characterName)
        characterHolder.append(`<button class="characterSelector" data-value= "${index}">${character.characterName}</button>`);
    });


});
}

//this function stores the selected character in local memory, so we can access that info on the game.js page
function selectCharacter(){
    var selectedCharacterIndex = $(this).attr('data-value');
    var selectedCharacter = characters[selectedCharacterIndex];
    
    localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
    
}

