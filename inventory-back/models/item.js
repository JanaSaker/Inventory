const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Item = sequelize.define('Item', {
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  status: DataTypes.STRING,
  image: DataTypes.STRING ,
});

module.exports = Item;
