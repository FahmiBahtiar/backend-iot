import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://blimbing:blimbing@codemarket-shard-00-00.ribpd.mongodb.net:27017,codemarket-shard-00-01.ribpd.mongodb.net:27017,codemarket-shard-00-02.ribpd.mongodb.net:27017/backend-iot?ssl=true&replicaSet=atlas-di072z-shard-0&authSource=admin&retryWrites=true&w=majority');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};