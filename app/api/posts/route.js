import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}

// Updated post schema with likes and comments
const postSchema = new mongoose.Schema({
    creator: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },  // Changed to imageUrl for consistency
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Like functionality
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
    }],
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

// GET request handler
export async function GET() {
    await connectToDatabase();

    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        console.log('Posts fetched:', posts);
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST request handler
export async function POST(req) {
    await connectToDatabase();

    try {
        // Extract the correct field name from the incoming request
        const { creator, title, content, image } = await req.json();  // Assuming frontend sends 'image'

        console.log('Received data:', { creator, title, content, image }); // Debugging

        // Use 'image' as the value for 'imageUrl'
        const newPost = new Post({ creator, title, content, imageUrl: image });

        console.log('Post to be saved:', newPost); // Debugging
        await newPost.save();
        console.log('Post saved:', newPost); // Debugging
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Failed to create post:', error); // Debugging
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}


// Function to test saving a post directly
// async function testSavePost() {
//     await connectToDatabase();

//     const testPost = new Post({
//         creator: 'test_creator',
//         title: 'test_title',
//         content: 'test_content',
//         imageUrl: 'http://example.com/image.jpg'  // Corrected to imageUrl
//     });

//     console.log('Test post to be saved:', testPost);

//     try {
//         const savedPost = await testPost.save();
//         console.log('Test post saved:', savedPost);
//     } catch (error) {
//         console.error('Failed to save test post:', error);
//     }
// }

// // Call the test function to check if saving works
// testSavePost();
