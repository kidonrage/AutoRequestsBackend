const driverSchedules = require('../mocks/driverSchedulesMock')

const TransportApplication = require("../models/TransportApplication")
const User = require('../models/User')
const { getDayIndexFromDateString, getDayIndexFromDate, getDateFromString } = require('../services/dateService')
const { getPublicDriverObjectFromUser } = require('../services/driversService')
const { getPublicPassengerObjectFromUser } = require('../services/passengersService')

const getUserTransportApplications = async (req, res) => {
  try {
    const { _id, type } = res.locals.user

    let userTransportApplications

    switch (type) {
      case 'passenger':
        userTransportApplications = await TransportApplication.find({
          passenger: _id
        })
        break
      case 'driver':
        userTransportApplications = await TransportApplication.find({
          driver: _id
        })
    }

    const nowDate = new Date()
    nowDate.setHours(0,0,0,0)
    
    const rawTransportApplications = userTransportApplications.filter(application => {
      const transportDate = new Date(application.date)
      transportDate.setHours(0,0,0,0)

      console.log(application.date, transportDate, nowDate)

      return transportDate >= nowDate
    })

    let results = []

    for (const transportApplication of rawTransportApplications) {
      const passengerUser = await User.findById(transportApplication.passenger)
      const driverUser = await User.findById(transportApplication.driver)

      const passenger = await getPublicPassengerObjectFromUser(passengerUser)
      const driver = await getPublicDriverObjectFromUser(driverUser)

      results.push({
        ...transportApplication._doc,
        passenger,
        driver
      })
    }

    res.status(200).json(results)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const saveTransportApplication = async (req, res) => {
  const { passengerId, driverId, address, date, timeRange, comment } = req.body

  console.log(req.body)

  try {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const parsedDate = getDateFromString(date)
    const dayIndex = getDayIndexFromDate(parsedDate)

    if (parsedDate < now) {
      // TODO: Проверять ещё и на прошедшее время сегодня
      console.log('Невозможно создать заявку на прошедшую дату', parsedDate, now)
      return res.status(400).json({
        message: 'Невозможно создать заявку на прошедшую дату'
      })
    }

    if (!driverSchedules[driverId][dayIndex] || !driverSchedules[driverId][dayIndex].includes(timeRange)) {
      console.log('Водитель не работает в этот день в это время')
      return res.status(400).json({
        message: 'Водитель не работает в этот день в это время'
      })
    }

    const alreadyScheduledTransportApplication = await TransportApplication.find({
      driver: driverId,
      date,
      timeRange
    })

    if (alreadyScheduledTransportApplication.length > 0) {
      console.log('Водитель уже забронирован для поездки на это время в эту дату')
      return res.status(400).json({
        message: 'Водитель уже забронирован для поездки на это время в эту дату'
      })
    }
    
    const transportApplicationToSave = new TransportApplication({
      passenger: passengerId, 
      driver: driverId, 
      address, 
      date, 
      timeRange, 
      comment
    })

    await transportApplicationToSave.save()
  
    res.status(200).send()
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

module.exports = {
  getUserTransportApplications,
  saveTransportApplication,
}