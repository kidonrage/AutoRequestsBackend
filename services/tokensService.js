const config = require('config')
const jwt = require('jsonwebtoken') 

function generateTokens(userId) {
  const accessToken = generateAccessToken(userId)
  const refreshToken = generateRefreshToken(userId)

  return { accessToken, refreshToken }
}

function generateAccessToken(userId) {
  return jwt.sign({ userId: userId }, config.get('accessTokenSecret'), { expiresIn: '1d' })
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId: userId }, config.get('refreshTokenSecret'))
}

module.exports = {
  generateTokens,
  generateAccessToken
}