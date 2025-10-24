import mongoose from 'mongoose';
import  config  from "../config/index.js"

const { DB_URL, APP_SECRET } = config;

const databaseConnection = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB Connected');
  } catch (error) {
    console.error('Database connection error:');
    console.error(error);
    process.exit(1);
  }
};

export default databaseConnection;