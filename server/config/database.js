const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config({path : "./config/.env"});


app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

module.exports=mongoose;
