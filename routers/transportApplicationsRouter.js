const { Router } = require('express')

const { getUserTransportApplications, saveTransportApplication } = require('../controllers/transportApplicationsController')

const router = Router()

router.get('/', getUserTransportApplications)

router.post('/', saveTransportApplication)

module.exports = router