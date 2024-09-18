import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// Database connection function
async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// User model schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '', // Default to empty string if no profile picture is provided
  },
});

// Check if the model is already compiled or compile it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// API route handler
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch creators' data (username and profile picture only)
    const creators = await User.find({}, 'username profilePicture');

    // Return the creators' data in JSON format
    return NextResponse.json(creators);
  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json({ message: 'Failed to fetch creators' }, { status: 500 });
  }
}
