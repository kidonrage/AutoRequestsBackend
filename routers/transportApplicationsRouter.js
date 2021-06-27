const { Router } = require('express')

const { getUserTransportApplications, saveTransportApplication } = require('../controllers/transportApplicationsController')

const router = Router()

router.get('transportApplication', requireAuth, getUserTransportApplications)

router.post('transportApplication', requireAuth, saveTransportApplication)

module.exports = router