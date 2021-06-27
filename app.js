// Импортируем сторонние библиотеки
const express = require('express')
const config = require('config')
const cookieParser = require("cookie-parser");


// Импортируем роутеры
const authRouter = require('./routers/authRouter')
const driversRouter = require('./routers/driversRouter')
const transportApplicationsRouter = require('./routers/transportApplicationsRouter')

// Импортируем middleware'ы
const { requireAuth } = require('./middleware/requireAuth')

// Создаем объект приложения
const app = express()

// Добавляем middleware для парсинга JSON в теле запроса
app.use(cookieParser())
app.use(express.json({extended: true}))

// Настраиваем роутеры
app.use('/api/auth', authRouter)
app.use('/api/drivers', requireAuth, driversRouter)
app.use('/api/transportApplications', requireAuth, transportApplicationsRouter)

// Импортируем вспомогательную функцию для подключения к БД
const connectToDB = require('./db')

// Получаем порт из конфигурации
const PORT = config.get('port')

async function start() {
  try {
    // Подключаемся к БД
    await connectToDB()

    // Запускаем сервер, слушаем порт PORT
    app.listen(PORT, () => {
      console.log("Сервер запущен и слушает порт " + PORT)
    })
  } catch (e) {
    // При ошибке выводим её в консоль
    console.log("Ошибка при запуске сервера: " + e)
  }
}

start()