import mongoose, { InferSchemaType, model } from 'mongoose';

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
export type EventType = InferSchemaType<typeof eventSchema> & { _id?: string };
export const Event = mongoose.models.Event || model('Event', eventSchema)