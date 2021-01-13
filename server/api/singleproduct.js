const router = require('express').Router()
const {Product} = require('../db/models')

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const allProds = await Product.findAll()
    res.json(allProds)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async function(req, res, next) {
  const id = req.params.id
  try {
    const thisProd = await Product.findByPk(id)
    res.json(thisProd)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id)
    await product.destroy()
    res.json(product)
  } catch (ex) {
    next(ex)
  }
})

router.put('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const product = await Product.findByPk(id)
    if (!product) {
      res.sendStatus(404)
    } else {
      await product.update(req.body)
      res.json(product)
    }
  } catch (ex) {
    next(ex)
  }
})

module.exports = router
