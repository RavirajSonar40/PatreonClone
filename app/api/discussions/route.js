import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * Schema for poll options within a discussion.
 */
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      option: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
});

/**
 * Schema for a discussion, including title, content, creator, comments, and an optional poll.
 */
const discussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: {
      name: { type: String, required: true },
      avatar: { type: String, default: 'default-avatar-url' },
    },
    comments: [
      {
        author: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    poll: pollSchema,
  },
  { timestamps: true }
);

/**
 * Mongoose model for discussions.
 */
const Discussion =
  mongoose.models.Discussion || mongoose.model('Discussion', discussionSchema);

/**
 * Connects to the MongoDB database if not already connected.
 */
const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } else {
    console.log('Already connected to MongoDB');
  }
};

/**
 * Handles GET requests to fetch all discussions.
 * @returns {NextResponse} JSON response with the list of discussions or an error message.
 */
export async function GET() {
  try {
    console.log('GET request received');
    await connectToDB();
    const discussions = await Discussion.find({});
    console.log('Discussions fetched:', discussions);
    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to create a new discussion.
 * @param {Request} req - The request object containing the discussion data.
 * @returns {NextResponse} JSON response with the created discussion or an error message.
 */
export async function POST(req) {
  try {
    console.log('POST request received');
    await connectToDB();
    const { title, content, creator, poll } = await req.json();

    console.log('Request body:', { title, content, creator, poll });

    const newDiscussion = new Discussion({
      title,
      content,
      creator: {
        name: creator.name,
        avatar: creator.avatar || 'default-avatar-url',
      },
      poll,
    });

    await newDiscussion.save();
    console.log('New discussion created:', newDiscussion);
    return NextResponse.json(newDiscussion, { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { message: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}