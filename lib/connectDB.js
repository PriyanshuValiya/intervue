import mongoose from "mongoose";

if (!process.env.NEXT_PUBLIC_MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
    }).then((mongoose) => mongoose);

    cached.conn = await cached.promise;

    console.log("DB Connected");
  }

  return cached.conn;
};

export default connectDB;