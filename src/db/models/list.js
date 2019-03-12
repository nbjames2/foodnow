'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastUpdated: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  List.associate = function(models) {
    // associations can be defined here
    List.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    List.hasMany(models.Listitem, {
      foreignKey: "listId",
      as: "listitems"
    });

    List.hasMany(models.ListAccess, {
      foreignKey: "listId",
      as: "listaccesses"
    });
  };
  return List;
};