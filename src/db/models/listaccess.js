'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListAccess = sequelize.define('ListAccess', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      }
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Lists",
        key: "id",
        as: "listId"
      }
    }
  }, {});
  ListAccess.associate = function(models) {
    // associations can be defined here
    ListAccess.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    
    ListAccess.belongsTo(models.List, {
      foreignKey: "listId",
      onDelete: "CASCADE"
    });
  };
  return ListAccess;
};