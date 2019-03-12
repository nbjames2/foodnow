'use strict';
module.exports = (sequelize, DataTypes) => {
  const Listitem = sequelize.define('Listitem', {
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Lists",
        key: 'id',
        as: 'listId'
      }
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purchased: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    max: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});
  Listitem.associate = function(models) {
    // associations can be defined here
    Listitem.belongsTo(models.List, {
      foreignKey: "listId",
      onDelete: "CASCADE"
    });
  };
  return Listitem;
};