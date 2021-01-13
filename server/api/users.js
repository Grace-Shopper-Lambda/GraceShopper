const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async function(req, res, next) {
  const id = req.params.id
  try {
    const thisUser = await User.findByPk(id)
    res.json(thisUser)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    await user.destroy()
    res.json(user)
  } catch (ex) {
    next(ex)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body)
    res.json(newUser)
  } catch (e) {
    next(e)
  }
})

router.put('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const user = await User.findByPk(id)
    if (!user) {
      res.sendStatus(404)
    } else {
      await user.update(req.body)
      res.json(user)
    }
  } catch (ex) {
    next(ex)
  }
})
