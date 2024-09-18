import mongoose from 'mongoose';
import User from '@/models/User'; // Ensure this path is correct

export async function GET(req, res) {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/GetMeVadapav");
    const creators = await User.find({ role: 'creator' }); // Assuming 'role' field denotes if the user is a creator
    res.status(200).json(creators);
  } catch (error) {
    console.error('Failed to fetch creators:', error);
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
}
