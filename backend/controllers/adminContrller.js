import validator from "validator"
import bycrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import DoctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import usermodel from "../models/userModel.js"
//api for adding doctors

const adddoctor = async (req,res) =>{
    try {

        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body
        const imageFile = req.file

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
        {
            return res.json({success:false,message:"missing details"})
        }

        //validatinf email format
        if(!validator.isEmail(email))
        {
            return res.json({success:false,message:"please enter valid email"})
        }
        //validate password
        if(password.length < 8)
        {
            return res.json({success:false,message:"please enter strong password"})
        }

        //hashing doc password

        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password,salt)

        //upload image to cloud
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})

        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        //add and save doctor in database
        const newDoctor = new DoctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor added"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//api for admin login
const loginAdmin = async(req,res) =>{
    try {
        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
        {
          const token = jwt.sign(email+password,process.env.JWT_SECREAT)
          res.json({success:true,token})
        }else{
            res.json({success:false,message:'Invalid creadintials'})
        }
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//API to get all doctors list for admin panel
const allDoctors = async (req,res) =>{
    try {
        const doctors = await DoctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message,message:error.message})
    }
}

//API for get all appointments list
const appointmentsAdmin = async (req,res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message,message:error.message})
    }
}

//API for appointment cancellation
const appointmentCancel = async (req,res) =>{
    try {
      const {appointmentId} = req.body
  
      const appointmentData = await appointmentModel.findById(appointmentId)
  
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
  
      //releasing doctor slot
      
      const {docId,slotDate,slotTime} = appointmentData
  
      const doctorData = await DoctorModel.findById(docId)
  
      let slot_booked = doctorData.slot_booked
  
      slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime)
  
      await DoctorModel.findByIdAndUpdate(docId,{slot_booked})
  
      res.json({success:true,message:'Appointment Cacelled'})
  
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  }
  //API to get dashboard data for admin panel

  const adminDashboard = async (req,res) => {
    try {
         
          const doctor = await DoctorModel.find({})
          const users = await usermodel.find({})
          const appointment = await appointmentModel.find({})

          const dashData = {
            doctor:doctor.length,
            appointment:appointment.length,
            patients:users.length,
            latestAppointment:appointment.reverse().slice(0,5)
          }

          res.json({success:true,dashData})

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
    
  }

export {adddoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}