// you could consider renaming this file for more specificity
// i think it would be more clear if the name of the model matched the name of the file
const Sequelize = require('sequelize')
const db = require('../db')

const Product = db.define('Product', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    // decimal data type is a solid choice - reasoning behind precision of 25? - make sure to still check the format of returned data on the front end. you might need to round to 2 decimal places before doing client-side math
    type: Sequelize.DECIMAL(25, 2),
    validate: {
      min: 0.01,
      notEmpty: true
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  // what about a place to hold the quantity if it is in stock?
  inStock: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    defaultValue: true
  },

  imageUrl: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true
    }
  },

  brand: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})
module.exports = Product
