const { Router } = require('express')
const { getDriversAvailable, getDriverAvailableTime } = require('../controllers/driversController')

const router = Router()

router.get('/available', getDriversAvailable)

router.get('/:driverId/timeAvailable', getDriverAvailableTime)

module.exports = router