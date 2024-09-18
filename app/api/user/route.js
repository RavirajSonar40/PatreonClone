import User from '@/models/User';
import mongoose from 'mongoose';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await mongoose.connect("mongodb://0.0.0.0:27017/GetMeVadapav");

  if (req.method === 'GET') {
    // Fetch user data
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } else if (req.method === 'PUT') {
    // Update user data
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error processing form' });
      }

      const { name, razorpayId, razorpaySecret } = fields;
      const user = await User.findOne({ email: req.user.email });

      if (files.profilePic) {
        const profilePicPath = `/uploads/${files.profilePic.newFilename}`;
        fs.renameSync(files.profilePic.filepath, `./public${profilePicPath}`);
        user.profilepic = profilePicPath;
      }

      if (files.coverPic) {
        const coverPicPath = `/uploads/${files.coverPic.newFilename}`;
        fs.renameSync(files.coverPic.filepath, `./public${coverPicPath}`);
        user.coverpic = coverPicPath;
      }

      user.name = name || user.name;
      user.razorpayId = razorpayId || user.razorpayId;
      user.razorpaySecret = razorpaySecret || user.razorpaySecret;

      await user.save();
      res.status(200).json(user);
    });
  }
}
