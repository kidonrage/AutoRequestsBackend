const jwt = require('jsonwebtoken')
const config = require('config')
const UserModel = require('../models/User')

const requireAuth = async (req, res, next) => {
  // Вытаскиваем токен из хэдера Authorization ('Bearer TOKEN')
  const user = await getUserFromAuthorizationHeader(req.headers.authorization)

  if (!user) {
    res.locals.user = null
    res.status(403).send()
  }

  res.locals.user = user
  next()
}

const checkUser = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.locals.user = null
    return next()
  }

  res.locals.user = await getUserFromAuthorizationHeader(req.headers.authorization)
  next()
}

const getUserFromAuthorizationHeader = async (authorizationHeaderValue) => {
  const token = authorizationHeaderValue.split(' ')[1]

  if (!token) {
    return null
  }

  try {
    const decodedToken = await jwt.verify(token, config.get('accessJWTSecret'))

    console.log(decodedToken)
    
    const user = await UserModel.findOne({ _id: decodedToken.userId })

    return user
  } catch (e) {
    return null
  }
}

module.exports = {
  requireAuth,
  checkUser
}