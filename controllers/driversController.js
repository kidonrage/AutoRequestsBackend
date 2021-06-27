const driverSchedules = require('../mocks/driverSchedulesMock')
const TransportApplication = require('../models/TransportApplication')

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
  res.status(200).send()
}

module.exports = {
  getDriversAvailable,
  getDriverAvailableTime,
}