const express = require('express');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const recipesRouter = require('./routes/recipes')
const authRouter = require('./routes/auth')
const UserRouter = require('./routes/user')
const cors = require('cors')
require('dotenv').config();
const dns = require("dns");

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])




const app = express()


//data Base connection 
connectDB();
// MiddleWares
app.use(cors())
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/recipes' , recipesRouter )
app.use('/api/auth' , authRouter);
app.use('/api/user' , UserRouter);



const PORT = process.env.PORT || 5001;
app.listen(PORT,'0.0.0.0', () =>{
  console.log(process.env.MONGODB_URI);
  console.log(`Server is running on http://localhost:${PORT}`)
})