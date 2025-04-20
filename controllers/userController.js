import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usermodel from '../models/userModel.js';
import {v2 as cloudinary} from "cloudinary"
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js';
// api to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter valid Email" });
    }

    // Strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter strong password" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashPassword
    };

    const newUser = new usermodel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT);
    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate token if password matches
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT, { expiresIn: '1d' });
    res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // Access userId from req object set by authUser middleware
    const userId = req.userId;

    const userData = await usermodel.findById(userId).select('-password');

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await usermodel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // Upload image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      const imageURL = uploadedImage.secure_url;

      await usermodel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//API to book doctor
const bookAppointment = async (req, res) => {
  try {
      const { docId, slotTime } = req.body;
      const userId = req.userId; // Extract userId from authUser middleware

      const docData = await doctorModel.findById(docId).select('-password');

      if (!docData.available) {
          return res.json({ success: false, message: 'Doctor not available' });
      }

      let slot_booked = docData.slot_booked;

      const date = new Date(req.body.date); //get the date from the request body.
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      //checking slot avilaility
      if (slot_booked[slotDate]) {
          if (slot_booked[slotDate].includes(slotTime)) {
              return res.json({ success: false, message: 'Slot not available' });
          } else {
              slot_booked[slotDate].push(slotTime);
          }
      } else {
          slot_booked[slotDate] = [];
          slot_booked[slotDate].push(slotTime);
      }

      const userData = await usermodel.findById(userId).select('-password');

      delete docData.slot_booked;

      const appointmentData = {
          userId,
          docId,
          userData,
          docData,
          amount: docData.fees,
          slotTime,
          slotDate,
          date: Date.now(),
      };

      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();

      //save new slots data in docData
      await doctorModel.findByIdAndUpdate(docId, { slot_booked });

      res.json({ success: true, message: 'Appointment Booked' });

  } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
  }
};

//API to get all appointment 
const listAppointment = async (req, res) => {
  try {
      const userId = req.userId;
      const appointments = await appointmentModel.find({ userId });

      res.json({ success: true, appointments });
  } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
  }
};

//API to cancell appointment
const cancelAppointment = async (req,res) =>{
  try {
    const {appointmentId} = req.body
    const userId = req.userId;

    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData.userId !== userId)
    {
      return res.json({success:false,message:'Unauthorized action'})
    }

    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    //releasing doctor slot
    
    const {docId,slotDate,slotTime} = appointmentData

    const doctorData = await doctorModel.findById(docId)

    let slot_booked = doctorData.slot_booked

    slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId,{slot_booked})

    res.json({success:true,message:'Appointment Cacelled'})

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}


export { registerUser, loginUser, getProfile,updateProfile ,bookAppointment,listAppointment,cancelAppointment};
