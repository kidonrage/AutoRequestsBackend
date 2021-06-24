const { Router } = require('express')
const config = require('config')
const { check } = require('express-validator')
const jwt = require('jsonwebtoken')

const { checkUser, requireAuth } = require('../middlewares/requireAuth')

const { Router } = require('express')
const { registerUser, logUserIn, updateUserRefreshToken } = require('../controllers/authController')

const router = Router()

router.post(
  '/register',
  [
    check('login', 'Некорректный login').islogin(),
    check('password', 'Пароль меньше 6 символов').isLength({ min: 6 })
  ],
  registerUser
)

router.post('/login',
  [
    check('login', 'Некорректный login').islogin(),
    check('password', 'Пароль меньше 6 символов').isLength({ min: 6 })
  ],
  logUserIn
)

router.post('/token', updateUserRefreshToken)

router.post('/logout', checkUser, logUserOut)

function generateTokens(userId) {
  const accessToken = generateAccessToken(userId)
  const refreshToken = generateRefreshToken(userId)

  return {
    accessToken,
    refreshToken
  }
}

function generateAccessToken(userId) {
  return jwt.sign(
    { userId: userId },
    config.get('accessTokenSecret'),
    { expiresIn: '25m' }
  )
}

function generateRefreshToken(userId) {
  return jwt.sign(
    { userId: userId },
    config.get('refreshTokenSecret')
  )
}

module.exports = router