// pages/api/polls/route.js
import mongoose from 'mongoose';

// Poll Schema with creatorName and creatorProfile fields
const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  votes: [Number],
  creatorName: String, // New field for creator's name
  creatorProfile: String, // New field for creator's profile URL
});

const Poll = mongoose.models.Poll || mongoose.model('Poll', pollSchema);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function GET(req, res) {
  try {
    await connectToDatabase();
    const polls = await Poll.find({});
    return new Response(JSON.stringify(polls), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch polls' }), { status: 500 });
  }
}

export async function POST(req, res) {
  try {
    const { question, options, creatorName, creatorProfile } = await req.json();
    await connectToDatabase();

    const newPoll = new Poll({
      question,
      options,
      votes: Array(options.length).fill(0),
      creatorName, // Add creatorName
      creatorProfile, // Add creatorProfile
    });

    await newPoll.save();
    return new Response(JSON.stringify(newPoll), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create poll' }), { status: 500 });
  }
}

export async function PUT(req, res) {
  try {
    const { pollId, optionIndex } = await req.json();
    await connectToDatabase();

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return new Response(JSON.stringify({ error: 'Poll not found' }), { status: 404 });
    }

    poll.votes[optionIndex] += 1;
    await poll.save();
    return new Response(JSON.stringify(poll), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update poll' }), { status: 500 });
  }
}
