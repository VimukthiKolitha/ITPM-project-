import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usermodel from '../models/userModel.js';
import {v2 as cloudinary} from "cloudinary"

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
const updateProfile = async (req,res) => {
  try {
    const {userId,name,phone,address,dob,gender} = req.body
    const imageFile = req.file

    if(!name || !phone || !dob || !gender)
    {
      return res.json({success:false,message:"Data Missing"})
    }

    await usermodel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
     
    if(imageFile)
    {
      const imageFile = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageURL = imageUpload.secure_url

      await usermodel.findByIdAndUpdate(userId,{imageURL})
    }
   
    res.json({success:true,message:"profile Upldated"}) 

  } catch (error) {
    console.log(error)
    res.json({success:false,message,getProfile})
  }
}

export { registerUser, loginUser, getProfile,updateProfile };
