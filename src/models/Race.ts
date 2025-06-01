import mongoose, { InferSchemaType, model } from 'mongoose';

const raceSchema = new mongoose.Schema(
  {
    event_id: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true }, //main, heat
    letter: { type: String, required: true }, // A, B, C, etc.
    num_cars: { type: Number, required: true }, 
    laps: { type: Number, required: true },
    num_transfers: { type: Number, required: true }, 
    first_transfer_position: { type: Number, required: true }, 
    intermission_lap: { type: Number, required: true }, 
  },
  { collection: 'events',
    versionKey: false, // 👈 disables __v
   }
);
export type RaceType = InferSchemaType<typeof raceSchema> & { _id?: string };
export const Race = mongoose.models.Race || model('Race', raceSchema);