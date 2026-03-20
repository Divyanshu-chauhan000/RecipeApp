const mongoose = require('mogoose');
require('dotenv').config();

const connectDB = async ()=>{
  try{
   await  mongoose.connnect(process.env.MONGODB_URI , {
    useNewUrlParser : true,
    useUnifiedTopology : true
   })
    console.log('DataBase Connected Successfully')
  }catch(err){
      console.log('Connection Failed', err )
      process.exit(1)
  }
}

module.exports = connectDB