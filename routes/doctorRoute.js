import express from 'express'
import { doctorslist,loginDoctor,appointmentDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,doctorProfileUpdate } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorslist)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointment',authDoctor,appointmentDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/doctor-dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/Update-Profile',authDoctor,doctorProfileUpdate)
export default doctorRouter