const Sequelize = require('sequelize')
const db = require('../db')

const OrderHistory = db.define('OrderHistory', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
  // you might also want to include price here in case the price changes
})

module.exports = OrderHistory
