import mongoose from 'mongoose';

const DiscussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creator: { type: String, required: true },
  poll: {
    question: { type: String, required: false },
    options: [{ option: { type: String, required: true }, votes: { type: Number, default: 0 } }],
  },
  comments: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      author: { type: String, required: true },
      content: { type: String, required: true },
      replies: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          author: { type: String, required: true },
          content: { type: String, required: true }
        }
      ]
    }
  ],
}, { timestamps: true });

export default mongoose.models.Discussion || mongoose.model('Discussion', DiscussionSchema);
