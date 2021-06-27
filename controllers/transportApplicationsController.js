const driverSchedules = require('../mocks/driverSchedulesMock')

const TransportApplication = require("../models/TransportApplication")
const { getDayIndexFromDateString } = require('../services/dateService')

const getUserTransportApplications = async (req, res) => {
  try {
    const { _id, type } = req.locals.user

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
    
    const results = userTransportApplications.filter(application => {
      const transportDate = new Date(application.date)

      return transportDate >= nowDate
    })

    res.status(200).json(results)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const saveTransportApplication = async (req, res) => {
  const { passengerId, driverId, address, date, timeRange, comment } = req.body

  try {
    const dayIndex = getDayIndexFromDateString(date)

    console.log(dayIndex)

    if (!driverSchedules[driverId][dayIndex] || !driverSchedules[driverId][dayIndex].includes(timeRange)) {
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