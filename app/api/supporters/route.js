import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Your MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
async function dbConnect() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    return mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

// Define Supporter Schema
const supporterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    amount: { type: Number, required: true },
});

// Create Supporter Model
const Supporter = mongoose.models.Supporter || mongoose.model('Supporter', supporterSchema);

export async function GET() {
    await dbConnect();
    
    try {
        const supporters = await Supporter.find({});
        return NextResponse.json(supporters);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch supporters' }, { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();
    
    try {
        const { name, message, amount } = await req.json();
        
        const newSupporter = new Supporter({
            name,
            message,
            amount
        });
        
        await newSupporter.save();
        
        return NextResponse.json(newSupporter, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add supporter' }, { status: 500 });
    }
}
