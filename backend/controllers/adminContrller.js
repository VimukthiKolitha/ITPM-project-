import validator from "validator"
import bycrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import DoctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'

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
export {adddoctor,loginAdmin,allDoctors}