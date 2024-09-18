// models/Supporter.js
import mongoose from 'mongoose';

const SupporterSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    amount: Number,
});

const Supporter = mongoose.models.Supporter || mongoose.model('Supporter', SupporterSchema);

export default Supporter;
