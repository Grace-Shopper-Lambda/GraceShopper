const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router
const verify = require('../auth/verify')

// no need to put this here since it already exists in users!
router.get('/', verify.isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email', 'isAdmin']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
