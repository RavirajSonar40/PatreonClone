import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    creator: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: String }],  // Use String for user IDs
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
