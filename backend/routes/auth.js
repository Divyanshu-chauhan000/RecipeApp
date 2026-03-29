const express = require('express')
const router = express.Router();
const User = require('../models/User');
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {signUpSchema , LoginSchema} = require('../validation/AuthValidation');
const { error } = require('node:console');
require('dotenv').config();

router.post('/register' , async (req, res) =>{
  try{
     
const result = signUpSchema.safeParse(req.body)
if(!result.success){
  return res.status(400).json({error: result.error.issues.map(x => x.message).join(', ')})
}

   const {fullName , email , password } = req.body;
   const isUserExist = await User.findOne({email})

   if(isUserExist){
    return res.status(400).json({message: "User Already Exist "});
   }
   const salt = await bcrypt.genSalt(10);
   const hashedPassword =  await bcrypt.hash(password, salt);

   const newUser = new User({fullName , email , password:hashedPassword})
   await newUser.save();

   res.status(201).json({message :  " User registered successfully"});
  }catch(err){
    return res.status(404).json({message : "Registration failed" , error: err.message});
    }
})

router.post('/login' , async (req, res) =>{
  try{
    const result = LoginSchema.safeParse(req.body)
if(!result.success){
  return res.status(400).json({error: result.error.issues.map(x => x.message).join(', ')})
}
    const {email , password} = req.body;
    const user = await User.findOne({email})
    
    if(!user){
      return res.status(400).json({message: "Invalid credentials"})
    }
    
    const isPasswordMatch = await bcrypt.compare(password , user.password)
    if(!isPasswordMatch){
        return res.status(400).json({message: "Invalid credentials"})
    }
    
    const payLoad = {
      id : user._id
    }
    const token = jwt.sign(payLoad , process.env.JWT_SECRET);

    const userData = {
      id : user._id,
      fullName: user.fullName,
      email : user.email,

    }
    return res.status(200).json({token , user: userData});

  }catch(err){
     return   res.status(404).json({message : "Login failed"});
  }
})


module.exports = router
