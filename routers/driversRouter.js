const { Router } = require('express')
const { getDriversAvailable, getDriverAvailableTime } = require('../controllers/driversController')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('driver/available', requireAuth, getDriverAvailableTime)

router.get('driver/:driverId/timeAvailable', requireAuth, getDriverAvailableTime)

module.exports = router