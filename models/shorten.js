import mongoose from 'mongoose';
import shortId from 'shortid';

const shortenSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true
    },
    short: {
        type: String,
        default: shortId.generate,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    clicks: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Shorten', shortenSchema);