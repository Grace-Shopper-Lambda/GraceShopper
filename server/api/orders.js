const router = require('express').Router()

const {Product, OrderHistory, Order} = require('../db/models')
module.exports = router

//(CART) retrieve user cart
router.get('/:id/cart', async (req, res, next) => {
  try {
    const cartItems = await Product.findAll({
      include: {
        model: Order,
        where: {
          UserId: req.params.id,
          processed: false
        }
      }
    })
    if (cartItems.length === 0) {
      // you can res.status(404).send(error) here, or just handle on the front end
      const error = new Error('API Cart Is Empty')
      // next(error)
    } else {
      res.json(cartItems)
    }
  } catch (err) {
    next(err)
  }
})

// this is a creative way to handle this - using req.params.action
//ensure it remains as put, increases and decreases quantity inside cart
router.put('/:id/cart/:action', async function(req, res, next) {
  console.log('ACTION----->', req.params.action)
  try {
    const ProductId = req.body.ProductId
    const OrderId = req.body.OrderId
    const orderItem = await OrderHistory.findOne({
      where: {
        ProductId: ProductId,
        OrderId: OrderId
      }
    })
    // i'm curious where increment and decrement are coming from? are these custom instance methods?
    if (req.params.action === 'add') {
      await orderItem.increment('quantity')
    }
    if (req.params.action === 'remove') {
      await orderItem.decrement('quantity')
    }
    res.json(orderItem)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/cart', async (req, res, next) => {
  //ensure that front-end has proper naming convention for id being sent as "ProductId"
  //ensure that front-end has proper naming convention for quantity being sent as "quantity"
  try {
    const currentProduct = await Product.findByPk(req.body.ProductId)
    console.log(currentProduct)
    const currentOrder = await Order.findOrCreate({
      where: {UserId: req.params.id, processed: false}
    })
    console.log(currentOrder)
    await currentOrder[0].addProduct(currentProduct)

    const newProduct = await Product.findByPk(req.body.ProductId, {
      include: {
        model: Order
      }
    })
    const orderItem = await OrderHistory.findOne({
      where: {
        ProductId: req.body.ProductId,
        OrderId: currentOrder[0].id
      }
    })
    if (req.body.quantity) {
      const newQuantity = req.body.quantity + orderItem.quantity - 1
      await orderItem.update({quantity: newQuantity})
    }
    res.json(newProduct)
  } catch (err) {
    next(err)
  }
})

//(CART) remove product in cart
router.delete('/:id/cart/:productId', async (req, res, next) => {
  try {
    const removedProduct = await Product.findByPk(req.params.productId)
    const currentOrder = await Order.findOne({
      where: {UserId: req.params.id, processed: false}
    })
    await currentOrder.removeProduct(removedProduct)
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

//GET user order history
router.get('/:id/orderHistory', async (req, res, next) => {
  try {
    const oldOrders = await Order.findAll({
      where: {UserId: req.params.id, processed: true},
      include: {model: Product}
    })
    res.json(oldOrders)
  } catch (err) {
    next(err)
  }
})

router.put('/:id/checkout', async (req, res, next) => {
  const UserId = req.params.id
  try {
    const currentOrder = await Order.findOne({
      where: {UserId: UserId, processed: false}
    })
    await currentOrder.update({
      processed: true
    })
    res.json(currentOrder)
    const newOrder = await Order.create()
    await newOrder.setUser(UserId)
  } catch (err) {
    next(err)
  }
})
