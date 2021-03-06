// Импортируем сторонние библиотеки
const express = require('express')
const config = require('config')

// Импортируем роутеры
const authRouter = require('./routers/authRouter')
const issuersRouter = require('./routers/driversRouter')
const bondsRouter = require('./routers/transportApplicationsRouter')

// Импортируем middleware'ы
const { requireAuth } = require('./middlewares/requireAuth')

// Создаем объект приложения
const app = express()

// Добавляем middleware для парсинга JSON в теле запроса
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