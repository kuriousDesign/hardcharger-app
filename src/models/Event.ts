import mongoose from 'mongoose'


const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
  },
  { collection: 'events',
    versionKey: false, // 👈 disables __v
   }
);

export default mongoose.models.Event || mongoose.model('Event', eventSchema)