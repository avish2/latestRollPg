var db = require("../models");

/*Steve:  edited characterName to include validation, lines 9 - 10 (allowNull and validate),
added lore to the character, lines  27- 32, includes validation 
(allowNull: true, validate for len). allowNull set to true for lore in case player doesn't want it.*/ 
module.exports = function(sequelize, DataTypes){
    var Character = sequelize.define('Character', {
        characterName: {
            type: DataTypes.STRING,
            index:true,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        class:{
            type: DataTypes.STRING
        },
        hp: {
            type: DataTypes.INTEGER
        },
        ap: {
            type: DataTypes.INTEGER
        },
        de: {
            type: DataTypes.INTEGER
        },
        weapon:{
            type: DataTypes.STRING
        },
        lore: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [1, 200]
            }
        }
        
    });

    Character.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Character.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return Character;
    }