import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  profilePic: { type: String }, // Store the URL of the profile picture
  coverPic: { type: String }, // Store the URL of the cover picture
  razorpayId: { type: String },
  razorpaySecret: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export the User model
export default mongoose.models.User || model("User", UserSchema);
