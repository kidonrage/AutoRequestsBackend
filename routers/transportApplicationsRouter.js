const { Router } = require('express')

const { getUserTransportApplications, saveTransportApplication } = require('../controllers/transportApplicationsController')

const router = Router()

router.get('transportApplication', getUserTransportApplications)

router.post('transportApplication', saveTransportApplication)

module.exports = router