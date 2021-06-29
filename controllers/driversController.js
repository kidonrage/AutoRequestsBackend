const driverSchedules = require('../mocks/driverSchedulesMock')
const TransportApplication = require('../models/TransportApplication')
const User = require('../models/User')
const { getPublicDriverObjectFromUser } = require('../services/driversService')

const getDriverAvailableTime = async (req, res) => {
  const { driverId } = req.params
  const { date } = req.query

  try {
    const parsedDate = new Date(date)

    const dayIndex = parsedDate.getDay() - 1

    if (!dayIndex) {
      throw new Error('Can\'t parse date')
    }

    const driverScheduleTimeRanges = driverSchedules[driverId][dayIndex]

    const driverApplicationsForDay = await TransportApplication.find({
      driver: driverId,
      date
    })

    const alreadyTakenTimeRangesForThatDay = driverApplicationsForDay.map((application) => application.timeRange)

    const driverAvailableTimeRanges = driverScheduleTimeRanges.filter(range => !alreadyTakenTimeRangesForThatDay.includes(range))

    res.status(200).json(driverAvailableTimeRanges)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const getDriversAvailable = async (req, res) => {
  const { date } = req.query

  console.log(date)

  try {
    const parsedDate = new Date(date)

    const dayIndex = parsedDate.getDay() - 1

    if (typeof(dayIndex) !== "number") {
      throw new Error('Can\'t parse date')
    }

    const driversIds = Object.keys(driverSchedules)

    const availableDriversIds = driversIds.filter(driverId => !!driverSchedules[driverId][dayIndex])

    const availableUsers = await User.find({
      '_id': { $in: availableDriversIds}
    })

    let results = []

    for (const user of availableUsers) {
      const driver = await getPublicDriverObjectFromUser(user)
      results.push(driver)
    }

    res.status(200).json(results)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

module.exports = {
  getDriversAvailable,
  getDriverAvailableTime,
}