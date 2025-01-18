import express from 'express'
const router = express.Router()

import createUserContact from '../controllers/usercontact-controller.js'

router.post('/contact-us',createUserContact)

export default router