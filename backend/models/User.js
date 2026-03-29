const mongoose = require('mongoose');


const Userschema = new mongoose.Schema({
  fullName:{
    type: String,
    trim: true,
    required: true,

  },
  email:{
    type: String,
    trim: true,
    required: true,
    unique : true
  },
  password:{
    type:String,
    trim : true,
    required: true,
  },
  profilepic:{
    type : String,
    default: "",
  }
}, {timestamps: true})

module.exports = mongoose.model('user' , Userschema)