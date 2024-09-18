// pages/api/payment.js
import mongoose from 'mongoose';
import Payment from '@/models/Payment'; // Assuming you have a Payment model

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // Already connected
    return;
  }
  // Connect to the database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      await connectDB();

      const { name, email, amount, message, username } = req.body;

      // Create a new payment document
      const payment = new Payment({
        name,
        email,
        amount,
        message,
        username,
      });

      // Save payment details to the database
      await payment.save();

      // Send success response
      res.status(201).json({ message: 'Payment details saved successfully' });
    } catch (error) {
      console.error('Error saving payment details:', error);
      res.status(500).json({ error: 'Failed to save payment details' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
