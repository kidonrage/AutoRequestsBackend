const { Router } = require('express')
const { check } = require('express-validator')

const { checkUser, requireAuth } = require('../middleware/requireAuth')

const { registerUser, logUserIn, logUserOut, updateUserRefreshToken } = require('../controllers/authController')

const router = Router()

router.post(
  '/register',
  [
    check('login', 'Некорректный login').isString().isLength({ min: 5 }),
    check('password', 'Пароль меньше 6 символов').isLength({ min: 6 })
  ],
  registerUser
)

router.post('/login',
  [
    check('login', 'Некорректный login').isString().isLength({ min: 5 }),
    check('password', 'Пароль меньше 6 символов').isLength({ min: 6 })
  ],
  logUserIn
)

router.post('/token', updateUserRefreshToken)

router.post('/logout', checkUser, logUserOut)

module.exports = router