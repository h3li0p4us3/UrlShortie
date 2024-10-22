import mongoose from 'mongoose';
import { nanoid } from 'nanoid';



const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return nanoid(7);
        }
    },
});

shortUrlSchema.pre('save', async function(next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const shortId = nanoid(7);
            const existing = await mongoose.models.shorts.findOne({ short: shortId });
            if (!existing) {
                this.short = shortId;
                isUnique = true;
            }
        }
    }
    next();
});

export default mongoose.model('shorts', shortUrlSchema);

