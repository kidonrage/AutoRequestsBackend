const mongoose = require('mongoose');
const config = require('config')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.get('mongoUri'),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    );

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB