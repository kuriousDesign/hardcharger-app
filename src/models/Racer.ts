import mongoose, { InferSchemaType, model } from 'mongoose';

const racerSchema = new mongoose.Schema(
  {
    race_id: { type: String, required: true },
    driver_id: { type: String, required: true },
    starting_position: { type: Number, required: true },
    current_position: { type: Number, required: true },
  },
  { collection: 'racers',
    versionKey: false, // 👈 disables __v
  }
);

export type RacerType = InferSchemaType<typeof racerSchema> & { _id?: string };
export const Racer = mongoose.models.Racer || model('Racer', racerSchema);