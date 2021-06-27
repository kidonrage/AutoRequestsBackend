const bcrypt = require('bcryptjs')
const config = require('config')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const { generateTokens, generateAccessToken } = require('../services/tokensService')

const registerUser = async (req, res) => {
  // Валидация
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array(),
      message: 'Некорректные данные при регистрации'
    })
    return
  }

  try {
    const { login, password, type, firstName, lastName, patronymic, mobileNumber } = req.body

    const candidate = await User.findOne({ login })

    if (candidate) {
      res.status(400).json({ message: "Пользователь с таким логином уже существует" })
      return
    }

    const salt = bcrypt.genSaltSync()
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      login,
      password: hashedPassword,
      firstName,
      lastName,
      patronymic,
      mobileNumber,
      type,
    })

    const savedUser = await user.save()
    const { password: userPassword, _id, ...publicUserData } = savedUser._doc

    const { accessToken, refreshToken } = generateTokens(_id)

    res.status(201).json({ message: "Пользователь создан", accessToken, refreshToken, user: publicUserData })
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Что-то пошло не так, попробуйте ещё раз" })
  }
}

const logUserIn = async (req, res) => {
  // Валидация
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array(),
      message: 'Некорректные данные при регистрации'
    })
    return
  }

  try {
    const { login, password } = req.body

    // Ищем пользователя с таким login
    const user = await User.findOne({ login })

    if (!user) {
      // Если не нашли
      return res.status(400).json({ message: "Пользователя с такими данными не существует" })
    }

    // Сравниваем шифрованный пароль из базы и пароль, полученный с запросом
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      // Если пароли не соответствуют
      return res.status(400).json({ message: "Неверный пароль. Попробуйте снова" })
    }

    const { accessToken, refreshToken } = generateTokens(user._id)

    const { password: userPassword, _id, ...publicUserData } = user._doc

    try {
      const existingRefreshTokens = user.refreshTokens || []

      await User.findByIdAndUpdate(_id, {
        refreshTokens: [...existingRefreshTokens, refreshToken]
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Что-то пошло не так при генерации токена. Попробуйте ещё раз" })
    }

    res.cookie('refreshToken', refreshToken).json({ accessToken, refreshToken, user: publicUserData })
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Что-то пошло не так, попробуйте ещё раз" })
  }
}

const updateUserRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies

  // if (!refreshToken || !user || !user.refreshTokens.includes(refreshToken)) {
  if (!refreshToken) {
    return res.status(401).send()
  }

  try {
    const { userId } = await jwt.verify(refreshToken, config.get('refreshTokenSecret'))

    const user = await User.findOne({ _id: userId })

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).send()
    }

    const accessToken = generateAccessToken(userId)

    res.status(200).json({ accessToken })
  } catch (e) {
    console.log(e)
    return res.status(403).send()
  }
}

const logUserOut = async (req, res) => {
  const { token } = req.body
  const { user } = res.locals

  if (user && user.refreshTokens.includes(token)) {
    try {
      await User.findByIdAndUpdate(user._id, {
        refreshTokens: user.refreshTokens.filter(refreshToken => refreshToken !== token)
      })
    } catch (e) {
      console.log(e)
      res.status(401).send()
    }
  }

  return res.status(200).json({})
}

module.exports = {
  registerUser,
  logUserIn,
  logUserOut,
  updateUserRefreshToken
}