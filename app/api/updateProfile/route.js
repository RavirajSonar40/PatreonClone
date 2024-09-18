// pages/api/updateProfile.js
import mongoose from "mongoose";
import User from "@/models/User"; // Adjust the import to match your User model's location

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { profilePic, coverPic, slogan } = req.body;

        if (!mongoose.connection.readyState) {
            // Ensure Mongoose is connected
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        try {
            const userId = req.user.id; // Assuming the user ID is available in req.user
            const user = await User.findByIdAndUpdate(
                userId,
                { profilePic, coverPic, slogan },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ message: "Failed to update profile" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
