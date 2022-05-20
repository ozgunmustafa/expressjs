const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./helpers/database/connectDB');
const customErrorHandler = require('./middlewares/error/customErrorHandler.js');
const path=require("path")

const routers = require('./routers/index.js');

dotenv.config({
  path: './config/env/config.env',
});

//Mongo DB Connection
connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

//Routers Middlewares
app.use('/api', routers);

//Static Files
app.use(express.static(path.join(__dirname,"public")))

//Error Handler
app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log('App started... PORT:' + PORT + ' mode:' + process.env.NODE_ENV);
});
