import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../models/User'; // Ensure the path is correct
import Feedback from '../../../models/Feedback'; // Ensure the path is correct

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return; // If already connected, do nothing
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function GET(request) {
  await connectDB();
  
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  
  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' } // Case-insensitive search
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users.' }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  
  try {
    const { userId, feedback } = await request.json();

    if (!userId || !feedback) {
      return NextResponse.json({ message: 'User ID and feedback are required.' }, { status: 400 });
    }

    // Check if the user exists before creating feedback
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const newFeedback = await Feedback.create({ userId, feedback });
    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ message: 'Failed to submit feedback.' }, { status: 500 });
  }
}
