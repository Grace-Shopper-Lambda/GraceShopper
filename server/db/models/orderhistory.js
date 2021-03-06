const Sequelize = require('sequelize')
const db = require('../db')

const OrderHistory = db.define('OrderHistory', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
})

module.exports = OrderHistory
