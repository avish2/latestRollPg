$(document).ready(function(){
//createWeaponsBtn();
//event handlers
$('#selectWeaponText').hide();
$('#goToCharactersPage').hide();
$('#submitCharacterDiv').hide();
$(document).on('click', '.classBtn', selectClass);
$(document).on('click', '.weaponsSelectorBtn', selectWeapon);
$(document).on('click', '#changeSelection', changeSelection );
$('#submitCharacter').on('click', createCharacter);

});

$('.btn').hover(function() {
    var id = $(this).attr('data-id');
    $('.b-' + id + '-text').show();
  }, function() {
    $('.b-text').hide();
  });

//consider adding name to class objects
var name = $('#characterName').val().trim();
var Archer;
var Mage;
var Warrior;

var archerWeapons = [{weaponName: "Longbow", value: 6},{weaponName: "Crossbow", value: 8}, {weaponName: "Shortsword", value: 4}];
var mageWeapons = [{weaponName: "Wand", value: 7},{weaponName: "Staff", value: 10}, {weaponName: "Dagger", value: 3}];
var warriorWeapons = [{weaponName: "Mace", value: 5},{weaponName: "Sword and Sheild", value: 7}, {weaponName: "Axe", value: 6}];

var selectedClass;
var selectedWeapon;


//when the user selcts their class the app will display the weapons associated with that class/
// from the selected class weapons array (defined as a global variable)
function selectClass(){
    selectedClass = $(this).attr('data-className');
    $('#selectedClassText').html(`Selected Class: ${selectedClass}`);
    $('.classBtn').hide();
    $('#selectWeaponText').show();
    console.log(selectedClass);

    switch(selectedClass){
        case "Archer":
            createArcherWeaponsBtn();
            break;
        case "Mage":
            createMageWeaponsBtn();
            break;
        case "Warrior":
            createWarriorWeaponsBtn();
            break;
    }

}
 
//after the user selects their class and the appropriate weapons display, 
//the selected weapon will be assigned depending on which btn the user clicks
//each weapons btn has a data-value attr that acts as the index of the selected btn from the selected class weapons array
function selectWeapon(){
    var selectedWeaponName = $(this).html().trim();
    var selectedWeaponIndex = $(this).attr('data-value');
    
    if(selectedWeaponName ==='Longbow' || selectedWeaponName === 'Crossbow' || selectedWeaponName === 'Shortsword'){
        selectedWeapon = archerWeapons[selectedWeaponIndex];
    }
    else if(selectedWeaponName ==='Wand'  || selectedWeaponName === 'Staff' || selectedWeaponName === 'Dagger'){
        selectedWeapon = mageWeapons[selectedWeaponIndex];
    }
    else if(selectedWeaponName ==='Mace' || selectedWeaponName === 'Sword and Sheild' || selectedWeaponName === 'Axe'){
        selectedWeapon = warriorWeapons[selectedWeaponIndex];
    }
    console.log(selectedWeapon);
    $('#selectWeaponText').html(`Selected Weapon: ${selectedWeaponName}`);
   // $('#selectWeaponsText').show();
    $('.weaponsSelectorBtn').hide();
    $('#submitCharacterDiv').show();
    

    Archer = {
        hp: 125,
        ap:12 + selectedWeapon.value,
        de:13,
        weapon: selectedWeaponName
    }
    
    Mage = {
        hp: 100,
        ap:10 + selectedWeapon.value,
        de:10,
        weapon: selectedWeaponName
    }
    
    Warrior = {
        hp: 150,
        ap: 15 + selectedWeapon.value,
        de: 15,
        weapon: selectedWeaponName
    }
    

}


//these functions display the weapons btns accociated with the user's selected class
function createArcherWeaponsBtn(){

    $('#selectWeaponsText').show();
    $('.mageWeapons').hide();
    $('.warriorWeapons').hide();

    var archerWeaponsHolder = $('#archerWeaponsHolder');
    archerWeapons.forEach(function(weapon, index) {
        archerWeaponsHolder.append(`<button class="weaponsSelectorBtn archerWeapons" data-value= "${index}" 
                                    "data-weapon="${archerWeapons[index].weaponName}">
                                    ${archerWeapons[index].weaponName}</button>`);
    });
}

function createMageWeaponsBtn(){

    $('#selectWeaponsText').show();
    $('.warriorWeapons').hide();
    $('.archerWeapons').hide();

    var mageWeaponsHolder = $('#mageWeaponsHolder');
    mageWeapons.forEach(function(weapon, index) {
        mageWeaponsHolder.append(`<button class="weaponsSelectorBtn mageWeapons" data-value= "${index}" 
                                  "data-weapon="${mageWeapons[index].weaponName}">
                                    ${mageWeapons[index].weaponName}</button>`);
    
    });
}


function createWarriorWeaponsBtn(){

    $('#selectWeaponsText').show();
    $('.archerWeapons').hide();
    $('.mageWeapons').hide();

    var warriorWeaponsHolder = $('#warriorWeaponsHolder');
    warriorWeapons.forEach(function(weapon, index) {
        warriorWeaponsHolder.append(`<button class="weaponsSelectorBtn warriorWeapons" data-value= "${index}" 
                                     "data-weapon="${mageWeapons[index].weaponName}">
                                    ${warriorWeapons[index].weaponName}</button>`);    
    });
}

// if the user wants to change their class or weapons selection the weapons btns will be hidden and the class btns will display
function changeSelection(){
    $('.classBtn').show();
    $('#selectWeaponText').html('Select Your Weapon');
    $('#selectWeaponText').hide();
    $("#selectedClassText").html('Select Character Class');
    $('#submitCharacterDiv').hide();
}
   

//this function  is executed on the create character btn click. runs the appropriate function depending on their selection
function createCharacter(){
    $('#submitCharacterDiv').hide();
    $('#goToCharactersPage').show();
    switch(selectedClass){
        case "Archer":
            createArcher();
            break;
        case "Mage":
            createMage();
            break;
        case "Warrior":
            createWarrior();
            break;
    }
}


//these functions send the selected class and weapoon info to be stored in the database 
function createArcher(){
console.log(selectedWeapon.weaponName)
    $.ajax({
        method: "POST",
        url: "api/character",
        data: {
               characterName: $('#characterName').val().trim(), //var name?
               class:"Archer",
               hp: Archer.hp,
               ap: Archer.ap,
               de: Archer.de,
               weapon: Archer.weapon,
               lore: $('#characterLore').val()
              },
        success: console.log('sent')
    });
};

function createMage(){
    
    $.ajax({
        method: "POST",
        url: "api/character",
        data: {
                characterName: $('#characterName').val().trim(), 
                class:"Mage",
                hp: Mage.hp,
                ap: Mage.ap,
                de: Mage.de,
                weapon: Mage.weapon,
                lore: $('#characterLore').val()
                },
        success: console.log('sent')
    });
};

function createWarrior(){

    $.ajax({
        method: "POST",
        url: "api/character",
        data: {
                characterName: $('#characterName').val().trim(), 
                class:"Warrior",
                hp: Warrior.hp,
                ap: Warrior.ap,
                de: Warrior.de,
                weapon: Warrior.weapon,
                lore: $('#characterLore').val()
                },
        success: console.log('sent')
    });
};

    