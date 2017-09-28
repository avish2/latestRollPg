$(document).ready(function(){
    initPage();
    $(document).on('click', '#createEnemyBtn', createEnemy);
    $(document).on('click', '#enemyCombatRollBtn', function(){enemyAttack(target)});
    $(document).on('click', '#enemyCheckRollBtn', displayEnemyCheckRoll);
    $(document).on('click', '#startSessionBtn', displayPlayers);
    $(document).on('click', '.target', function(){
       
        playerIndex = $(this).attr('data-val');
        target = playerArr[playerIndex];
        console.log(playerIndex);
        console.log(target);
    
    });
    });
    
    
    var socket = io();
    var playerArr = [];
    var currentPlayerTurn;
    var currentEnemy;
    var displayRollArr = [];
    var result;
    var activeGame = false;
    var target;
    var playerIndex;
    
    socket.on('connection',function(socket){
        console.log(socket.id)
    });
    
    socket.on('newPlayer', function(data){
        playerArr.push(data);
        $('#welcome').hide();
        if(activeGame === false){
            $('#startSession').show();
        }
        activeGame = true;
        
    });
    
    
    function initPage(){
        $('#createEnemyBtn').hide();
        $('#enemyCombatRollBtn').hide();
        $('#enemyCheckRollBtn').hide();
        $('#startSession').hide();
    }
    
    
    function enemyAttack(player){
        $('.target').prop('checked', false);
        currentEnemy.combatRoll(player);
        displayEnemyCombatRoll();
        $(`#${playerIndex}Hp`).html(`HP: ${player.hp}`);
        checkIfPlayerIsAlive(player);
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
    
        //socket.emit('enemyCheckRoll', 'enemyCheckRoll');
    }
    
    function sendPlayerInfo(player){
        socket.emit('playerDamage', player)
        socket.on('playerDamage', function(data){
            if(result === 'Success'){
                console.log(`${player.name} Has taken damage!`);
            }else{console.log('Enemy attempt failed!')}
            
        
        });
    }
    
    function checkIfPlayerIsAlive(player){
        if(player.hp <= 0){
            $(`#playerList${playerIndex}`).hide();
            $('#deathDiv').html(`${player.name} Has Fallen!`);
            playerArr.splice(playerIndex, 1);
            if(playerArr.length === 0){
                $('#playerDiv').hide('');
                $('#deathDiv').hide();
                $('#dmBtns').hide('');
                $('#enemyDiv').hide();
                $('#diceDiv').hide();
                $('#evilDiv').html('The Forces of Evil have Triumphed!');
            }
            $('#playerDiv').html('');
            displayPlayers();
            console.log(playerArr);
        }else{return}
    }
    
    function displayPlayers(){
          
        $('#playerDiv').show();
        $('#startSession').hide();
        playerArr.forEach(function(playerInArr, index){
        $('#playerDiv').append(`<h4 id="${index}"><input class="target" data-val="${index}" type="checkbox" class="form-check-input">${playerInArr.name}</h4>`);
        $('#playerDiv').append(`
                                <ul id="playerList${index}">
                                <li id="${index}Hp">HP: ${playerInArr.hp}</li>
                                <li>AP: ${playerInArr.ap}</li>   
                                <li>DE: ${playerInArr.de}</li>   
                                <li>Weapon: ${playerInArr.weapon}</li>
                                <li>Lore: ${playerInArr.lore}</li></ul>                        
                                `);
        });
        $('#createEnemyBtn').show();
    
    }
    
    var enemy = {
        name:'Owl Bear',
        hp: 200,
        ap: 25,
        de: 25,
        alive: true,
        weapon: 'Talons',
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
            displayRollArr = [];
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
        if(data.hp <= 0){
            console.log('ded')
            $('#enemyDiv').hide();
            $('#enemyDeathDiv').html(`Owl Bear HAS FALLEN!`)
        }else{
        $('#enemyHp').html('HP: ' + data.hp);
        }
    });

    
    