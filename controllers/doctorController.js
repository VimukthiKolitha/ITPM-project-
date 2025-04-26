import DoctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req,res) =>{
    try {
         const {docId} = req.body
         const docData = await DoctorModel.findById(docId)
          await DoctorModel.findByIdAndUpdate(docId,{available:!docData.available})
          res.json({success:true,message:'Availability changed'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorslist = async(req,res) =>{
    try {
        const doctors = await DoctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//API to doctor Login

const loginDoctor = async (req,res) =>{
    try {
        const {email,password} = req.body
        const doctor = await DoctorModel.findOne({email})

        if(!doctor)
        {
            return res.json({success:false,message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(isMatch)
        {
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECREAT)

            res.json({success:true,token})
        }else{
            res.json({success:false,message:'Invalid credentials'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get doctor appointment for doctorpannel
const appointmentDoctor = async (req,res) =>{
    try {
        
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to mark appointment completed for doctor panel
const appointmentComplete = async (req,res) =>{
    try {
        const {docId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId.toString() === docId) // Corrected: appointmentData.docId and toString()
        {
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:'Appointment Completed'})
        }else{
            return res.json({success:false,message:'mark failed'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to Calcel appointment to for doctor pannel
const appointmentCancel = async (req,res) =>{
    try {
        const {docId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId.toString() === docId) // Corrected: appointmentData.docId and toString()
        {
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:'Appointment Canceled'})
        }else{
            return res.json({success:false,message:'cancelation failed'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get dashboard data for doctor panel
const doctorDashboard = async (req,res) => {
    try {
        
        const {docId} = req.body
        
        const appointment = await appointmentModel.find({docId})

        let earnings  = 0
        appointment.map((item) =>{
            if(item.isCompleted)
                {
                    earnings += item.amount
                }
        })

        let patients = []
          
        appointment.map((item) =>{
            if(!patients.includes(item.userId))
                {
                    patients.push(item.userId)
                }
        })

        const dashData = {
            earnings,
            appointment:appointment.length,
            patients:patients.length,
            latestAppointments:appointment.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//API to get doctor profile 
const doctorProfile = async (req,res) =>{
    try {
        const {docId} = req.body
        const profileData = await DoctorModel.findById(docId).select('-password')

        res.json({success:true,profileData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to update doctor profile data from doctor profile 
 const doctorProfileUpdate = async (req,res) =>{
    try {
        const {docId,fees,address,available} = req.body
    
        await DoctorModel.findByIdAndUpdate(docId,{fees,address,available})
    
        res.json({success:true,message:'Profile Updated'})
     } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
     }
    
 }
export {changeAvailability,doctorslist,loginDoctor,appointmentDoctor,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,doctorProfileUpdate}