import express from 'express'
import { doctorslist } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorslist)

export default doctorRouter