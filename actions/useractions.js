"use server";

import mongoose from "mongoose";
import User from "@/models/User"; // Import your User model
import Razorpay from "razorpay";
import Payment from "@/models/Payment";

// Helper function to ensure a single connection to MongoDB
const connectToMongoDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb://0.0.0.0:27017/GetMeVadapav", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, updateData) => {
  await connectToMongoDB(); // Ensure this matches your MongoDB setup

  try {
    // Fetch the current user data to preserve email and username
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Update only allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: updateData.name || user.name,
        profilePic: updateData.profilePic || user.profilePic,
        coverPic: updateData.coverPic || user.coverPic,
        razorpayId: updateData.razorpayId || user.razorpayId,
        razorpaySecret: updateData.razorpaySecret || user.razorpaySecret,
        // Do not update email and username
      },
      { new: true } // Return the updated document
    );

    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update user profile: " + error.message);
  }
};

// Function to fetch user profile data
export const getUserProfile = async (userId) => {
  await connectToMongoDB(); // Ensure this matches your MongoDB setup

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Failed to fetch user profile: " + error.message);
  }
};

// Function to initiate payment
export const initiate = async (amount, to_user, paymentform) => {
  await connectToMongoDB();

  try {
    var instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Define options for creating the order
    let options = {
      amount: Number.parseInt(amount) * 100, // Amount in paise (subunits)
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`, // Corrected template literal syntax
      notes: {
        key1: "value1",
        key2: "value2",
      },
    };

    // Create the order
    let order = await instance.orders.create(options);

    // Save payment details in the database
    await Payment.create({
      oid: order.id,
      amount: amount,
      to_user: to_user,
      name: paymentform.name,
      message: paymentform.message,
    });

    return order;
  } catch (error) {
    throw new Error("Failed to initiate payment: " + error.message);
  }
};
