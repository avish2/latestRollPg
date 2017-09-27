# RollPG
Readme

Team
Stephen Hopkins
Tyler Frega
Angela Vish
Aaron Toliver
Logan Hasty


RollPG is a gaming companion application meant to streamline the complex mathematical processes that drive tabletop role playing games. The application allows users to create characters, dungeon masters to create enemies, and for all the math behind the battle and encounter mechanics to be calculated online, instantly. This allows a session to move faster, and for the focus to be on the storytelling aspect of the activity. Also by using Socket IO, a gaming session can be facilitated over vast distances.

Libraries and Technologies
HTML, CSS, Bootstrap, Handlebars, Javascript, JQuery, node, Express, Sequelize, Passport, Socket IO.
Featured Technology Socket IO - a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.js. Like Node.js, it is event-driven.

Instructions
Registration: All users, players and dungeon masters, are required to register. Users will be able to select the role of dungeon master or player once they have logged in. 

Home Page: Users will have the option to create a new player character, peruse a list of previously created characters, or decide to become a dungeon master. 

Character Creation Page: The user will enter text into two fields. Character Name(self explanatory) and Character Lore, which is a short overview of the characters background, goals, etc. Select one of three classes, Archer, Mage, Warrior, and one of three weapons for each respective class. Once this is complete, the player character is added to the player’s list of character. The player can then select a character so use in the game session. 

Dungeon Master Page: From the home page, the user can choose to play as the Dungeon Master. Once selected the user will wait for players to join the lobby. Once all players have selected their character to take into the quest, the dungeon master can start a new session. The player characters and their statistics will be displayed. The dungeon master can then create a new enemy or non player character.

Combat Roll: Both player characters and non player characters have a combat roll, which facilitates the roll of three ten sided dice, the addition of those dice to the character/non-player character's attack power and weapon power, and the subtraction of that sum from the opposite character’s health points. 

Check Roll: Both player characters and non player characters have a combat roll, which facilitates the roll of one ten sided die. This determines a pass fail function to miscellaneous character actions such as jumping over a ditch. The dungeon master also has an Encounter Roll, which facilitates enemy encounters and other events.

End Of Game: The game will end once all enemies created by the dungeon master have been eliminated, or once all characters created by the players have been eliminated. It is advised that the dungeon master create more than one enemy (aka mob) for the session to last as long as desired. 

Development Trajectories
Home Brew: When participants of a game want to customize the rules of the game it is called a home brew. Most customizable parts of tabletop roleplaying have mathematical elements behind them. RollPG could allow players and dungeon masters to fully customize character sheets, and customize the side of the dice to 4, 6, 8, 10, 12, or 20.

Remote Tabletop Gaming: Text, audio and video chat along with file sharing capabilities will make RollPG a worldwide gaming platform. 

Videogame: Due to the capabilities Socket IO, RollPG, could be developed into a video game.
