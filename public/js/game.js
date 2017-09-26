$(document).ready(function(){
createPlayer();
setCharacterInfo();
//setEnemyInfo();
$(document).on('click', '#combatRoll', function(){attack(enemy)});
$('#checkRoll').on('click', CheckRoll);

});
var enemy;
var socket = io();
socket.on('newEnemy', function(data){
    setEnemyInfo(data);
     enemy = data;
          
});
socket.on('enemyDamage', function(data){
    setEnemyInfo(data);
     enemy = data;
          
});
socket.on('playerDamage', function(data){
    if(data.name === player.characterName){
        checkIfPlayerIsAlive(data);
        updatePlaterHp(data);
        player.hp = data.hp;
        $('#playerHp').html(`HP: ${player.hp}`);
    }else{console.log('enemy attack failed')}
    
})

$("#rollDice").on('click', function(){
    console.log("hello");
    $('#diceHolder').css("display:inline");
    $('#diceTotal').empty();
    $('#diceOutcome').empty();
    $('#diceTotal2').empty();
    $('#diceOutcome2').empty();
    $("#checkModal").css("display","none");
    $("#combatModal").css("display","none");
});


var characterFromLocalStorage = JSON.parse(localStorage.getItem('selectedCharacter'));
var player;
var displayRollArr = [];
var rollTotalDisplay;
var rollResult;


///this function executes the necessary code to preform and display the results from our player.combat roll function
function attack(enemy){
    console.log(enemy)
    player.combatRoll(enemy);
    displayCombatRoll();
    setEnemyInfo(enemy);
    sendEnemyInfo(enemy);
}

function sendEnemyInfo(enemy){
    socket.emit('enemyDamage', enemy)
    socket.on('enemyDamage', function(data){
        console.log('enemy damage sent')
    }) 
}


//this funcion displays the results of the users dice rolls. 
//for now, we store the the results of the dice rolls from the player.combatRoll and player.check roll as global variables 
//so they can be accessed by other functions

function displayCombatRoll() {
    $('#combatModal').css( "display", "inline" );
    $('#checkModal').css( "display", "none" );
    $(".dieIcon").css("display","none");
    $(".rollAnimation").attr("src", "");
    $(".rollAnimation").css("display","inline");
    $(".rollAnimation").attr("src", "/img/dice/rollAnimation.gif");
    setTimeout(function() {
        $(".dieIcon").css("display","none");
        var rollnumber1 = displayRollArr[0];
        var rollnumber2 = displayRollArr[1];
        var rollnumber3 = displayRollArr[2];
        console.log("1:" + rollnumber1);
        console.log("2:" + rollnumber2);
        console.log("3:" + rollnumber3);
        $('#diceNumbers').html("You rolled " + rollnumber1 + ", " + rollnumber2 + " and " + rollnumber3);
        $('#diceTotal').html(`Total = ${rollTotalDisplay}`);
        $('#diceOutcome').html(`${rollResult}`);
        $(".dice1[data-value='" + rollnumber1 + "']").css("display","inline");
        $(".dice2[data-value='" + rollnumber2 + "']").css("display","inline");
        $(".dice3[data-value='" + rollnumber3 + "']").css("display","inline");
            displayRollArr = []; 
    }, 2500);
}

function CheckRoll() {
    $('#checkModal').css( "display", "inline" );
    $('#combatModal').css( "display", "none" );
    $(".dieIcon").css("display","none");
    $(".rollAnimation").attr("src", "");
    $(".rollAnimation").css("display","inline");
    $(".rollAnimation").attr("src", "/img/dice/rollAnimation.gif");
    setTimeout(function() {
        player.checkRoll();
        var checkrollnumber = displayRollArr[0];
        $(".dieIcon").css("display","none");
        $('#diceTotal2').html("You rolled " + checkrollnumber);
        $('#diceOutcome2').html(`${rollResult}`);
        $("img[data-value='" + checkrollnumber + "']").css("display","inline");
            displayRollArr = []; 
    }, 2500);
}


//this creates a new instance of our constructor function and assigns the object the variable name "player"
//we will use the player variable name to preform attack and check functions on the game page
function createPlayer(){
    var selectedCharacter = characterFromLocalStorage;
    
    sessionCharacter = new Character(selectedCharacter.characterName, 
                                         selectedCharacter.class,
                                         selectedCharacter.hp,
                                         selectedCharacter.ap,
                                         selectedCharacter.de,
                                         selectedCharacter.alive,
                                         selectedCharacter.weapon,
                                         selectedCharacter.lore
                                        );
    player = sessionCharacter;
   
    socket.emit('newPlayer', {
        name:player.characterName,
        hp: player.hp,
        ap: player.ap,
        de: player.de,
        alive: player.alive,
        weapon: player.weapon,
        lore: player.lore
                        
    });
    socket.on('newPlayer', function(data){
        console.log(data);
    });
}

//this function displays our characters stats. hp, ap, de, class and weapon name
function setCharacterInfo(){

    $('#characterName').html(player.characterName);
    $('#lore').html(player.lore);
    $('#characterInfoDisplay').html(`<li class= "characterAttributes" id="playerHp"> Hp: ${player.hp}</li>
                                       <li class= "characterAttributes"> Ap: ${player.ap}</li>
                                       <li class= "characterAttributes"> De: ${player.de}</li>
                                       <li class= "characterAttributes"> Class: ${player.characterClass}</li>
                                       <li class= "characterAttributes"> Weapon: ${player.weapon}</li>
                                       `);
}

function checkIfPlayerIsAlive(player){
    console.log('alive')
    if(player.hp <= 0){
        $('#characterInfoDisplay').hide();
        $('#characterName').html(`${player.name} Has Fallen!`);
        $('#combatRoll').hide();
        $('#checkRoll').hide();
        killPlayer(player);
    }else{
        return
    }
}

function updatePlaterHp(player){
    $.ajax({
        method: "put",
        url: "api/updateHp",
        data: {
                characterName: player.name, 
                hp: player.hp,
                },
        success: console.log('hp updated')
    });
}

function killPlayer(player){
    $.ajax({
        method: "delete",
        url: "api/killPlayer",
        data: {
                characterName: player.name, 
                
                },
        success: console.log('hp updated')
    });
}

//this function displays the current enemy stats
function setEnemyInfo(enemy){
    if(enemy.hp <= 0){
        enemy.alive === false
        $('#enemyName').html(`${enemy.name} has fallen`);
        $('#enemyInfoDisplay').hide();
        
        enemy = '';
    }else{
    $('#enemyName').html(`${enemy.name}`)
    $('#enemyInfoDisplay').html(`<li class= .enemyAttributes> Hp: ${enemy.hp}</li>
                                     <li class= .enemyAttributes> Ap: ${enemy.ap}</li>
                                     <li class= .enemyAttributes> De: ${enemy.de}</li>
                                     <li class= .enemyAttributes> Chosen Weapon: ${enemy.weapon}</li>`);
    }

}

//our constructor function. This takes the info from the selected character (stored in local memory on the getCharacterInfo.js page)
//and creates a new object with attack and check methods attached
function Character(characterName, characterClass, hp, ap, de, alive, weapon, lore) {
    this.characterName = characterName;
    this.characterClass = characterClass;
    this.hp = hp;
    this.ap = ap;
    this.de = de;
    this.alive = true;
    this.weapon = weapon;
    this.lore = lore;
    this.combatRoll = function(enemy){
        var roll1 = Math.floor((Math.random() * 10) + 1);
        var roll2 = Math.floor((Math.random() * 10) + 1);
        var roll3 = Math.floor((Math.random() * 10) + 1);
        var rollTotal = roll1 + roll2 + roll3;
        var result;
    
        if(rollTotal < 4){
            result = 'Critical Fail';
            this.hp -= rollTotal + this.ap;
        }
        else if(rollTotal >= 4 && rollTotal < 15){
            result = 'Fail';
        }
        else if(rollTotal >=15 && rollTotal <27){
            result = 'Success';
            enemy.hp -= rollTotal + this.ap - enemy.de;
        }
        else if(rollTotal >= 27){
            result = 'Critical Success';
            enemy.hp -= rollTotal + rollTotal + this.ap;
        }
        displayRollArr.push(roll1);
        displayRollArr.push(roll2);
        displayRollArr.push(roll3);
        rollResult = result;
        rollTotalDisplay = rollTotal;
        
        console.log(enemy.de)
        console.log(enemy)    
    };
    this.checkRoll = function(){
        roll = Math.floor(Math.random() * 10) + 1;
        
        if(roll >=5) {
            displayRollArr = [];
            displayRollArr.push(roll);
            rollResult = 'Success';        
        }
        else if(roll < 5) {
            displayRollArr = [];
            displayRollArr.push(roll);
            rollResult = 'Fail';        
        }
    }
    
}

