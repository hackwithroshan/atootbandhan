import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Exit process with failure
    // FIX: Suppress TypeScript error for `process.exit`. This is a valid Node.js function, but the type definitions seem to be incomplete in this project environment.
    // @ts-ignore
    process.exit(1);
  }
};

export default connectDB;