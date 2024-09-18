import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}

const postSchema = new mongoose.Schema({
    creator: { type: String, required: true },
    title: { type: String, required: true }, // Ensure title is also required if necessary
    content: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
    }],
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

async function seedPosts() {
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
        const samplePosts = [
            {
                creator: 'John Doe',
                title: 'My First Post',
                content: 'This is my very first post on this platform!',
                imageUrl: 'https://nikonrumors.com/wp-content/uploads/2014/09/Nikon-D750-sample-photo1.jpg',
                likes: [],
                comments: [],
            },
            // Additional posts...
        ];

        console.log('Sample posts:', samplePosts); // Check data before inserting
        await Post.insertMany(samplePosts);
        console.log('Sample posts seeded successfully');
    }
}

export async function GET() {
    await connectToDatabase();
    await seedPosts(); // Seed the sample posts if database is empty

    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        console.log('Posts fetched:', posts); // Check what’s being fetched
        return new Response(JSON.stringify(posts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
