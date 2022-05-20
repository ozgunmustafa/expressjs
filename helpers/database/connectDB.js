const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('mongodb connected');
    })
    .catch((err) => console.log(err));
};

module.exports = connectDB;
