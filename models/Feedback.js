import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    content: { type: String, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
