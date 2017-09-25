$(document).ready(function(){
initPage();
$(document).on('click', '#createEnemyBtn', createEnemy);
$(document).on('click', '#enemyCombatRollBtn', function(){enemyAttack(playerArr[turnCounter])});
$(document).on('click', '#enemyCheckRollBtn', displayEnemyCheckRoll);
})



var socket = io();
var playerArr = [];
var turnCounter = 0;
var currentPlayerTurn;
var currentEnemy;
var displayRollArr = [];

socket.on('connection',function(socket){
    console.log(socket.id)
})

socket.on('newPlayer', function(data){
    playerArr.push(data);
    //currentPlayerTurn  = playerArr[turnCounter];
    //console.log(currentPlayerTurn);
    displayPlayer(data);
});



function initPage(){
    $('#createEnemyBtn').hide();
    $('#enemyCombatRollBtn').hide();
    $('#enemyCheckRollBtn').hide();

}

function enemyAttack(player){
   // player  = playerArr[turnCounter];
    if(turnCounter>=playerArr.length){turnCounter === 0}
    currentEnemy.combatRoll(player);
    console.log(player);
    displayEnemyCombatRoll();
    $('#playerHp').html(`HP: ${player.hp}`);
    sendPlayerInfo(player);
    
}

function displayEnemyCombatRoll(){
    $('#diceDiv').html(`Dice Rolls: ${displayRollArr[0]},  ${displayRollArr[1]}, 
    ${displayRollArr[2]}, Total: ${rollTotalDisplay}, 
    Result: ${rollResult}`
    );
}

function displayEnemyCheckRoll(){
    currentEnemy.checkRoll();
    $('#diceDiv').html(`Dice Roll: ${displayRollArr[0]}
        Result: ${rollResult}`);
        displayRollArr = [];    
}

function sendPlayerInfo(player){
    socket.emit('playerDamage', player)
    socket.on('playerDamage', function(data){
        console.log('player damage sent');
    checkIfPlayerIsAlive(player);
    }) 
}

function checkIfPlayerIsAlive(player){
    if(player.hp <= 0){
        $('#playerList').hide();
        $('#playerName').html(`${player.name} Has Fallen!`);
    }else{return}
}

function displayPlayer(data){
$('#welcome').hide();
$('#playerDiv').append(`<h4 id="playerName">${data.name}</h4>`);
$('#playerDiv').append(`
                        <ul id="playerList">
                        <li id="playerHp">HP: ${data.hp}</li>
                        <li>AP: ${data.ap}</li>   
                        <li>DE: ${data.de}</li>   
                        <li>Weapon: ${data.weapon}</li>
                        <li>Lore: ${data.lore}</li></ul>                        
`);
$('#createEnemyBtn').show();

}

var enemy = {
    name:'Owl Bear',
    hp: 300,
    ap: 50,
    de: 30,
    alive: true,
    weapon: 'Tallons',
    lore: 'The most feared beast in the land'
}




function Enemy(name, hp, ap, de, weapon, lore ) {
    this.name = name;
    this.hp = hp;
    this.ap = ap;
    this.de = de;
    this.alive = true;
    this.weapon = weapon;
    this.lore = lore;
    this.combatRoll = function(player){
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
            player.hp -= rollTotal + this.ap - player.de;
        }
        else if(rollTotal >= 27){
            result = 'Critical Success';
            player.hp -= rollTotal + rollTotal + this.ap;
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


function createEnemy(){
    var selectedEnemy = enemy;
   
   sessionEnemy = new Enemy(selectedEnemy.name, 
                            selectedEnemy.hp,
                            selectedEnemy.ap,
                            selectedEnemy.de,
                            selectedEnemy.weapon,
                            selectedEnemy.lore
                            );

    currentEnemy = sessionEnemy;

                                                
   socket.emit('newEnemy', {
       name:currentEnemy.name,
       hp: currentEnemy.hp,
       ap: currentEnemy.ap,
       de: currentEnemy.de,
       alive: currentEnemy.alive,
       weapon: currentEnemy.weapon,
       lore: currentEnemy.lore
                       
   });
   socket.on('newEnemy', function(data){
       displayEnemy(data);
   });
}

function displayEnemy(data){
    $('#enemyDiv').append(`<h4>${data.name}</h4>`);
    $('#enemyDiv').append(`
                            <ul>
                            <li id="enemyHp" >HP: ${data.hp}</li>
                            <li>AP: ${data.ap}</li>   
                            <li>DE: ${data.de}</li>   
                            <li>Weapon: ${data.weapon}</li>
                            <li>Lore: ${data.lore}</li></ul>`);
    $('#enemyCombatRollBtn').show();
    $('#enemyCheckRollBtn').show();

}

    socket.on('enemyDamage', function(data){
        $('#enemyHp').html(data.hp);
    });
