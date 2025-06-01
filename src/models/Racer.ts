import mongoose, { InferSchemaType, model } from 'mongoose';

const racerSchema = new mongoose.Schema(
  {
    race_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    driver_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    starting_position: { type: Number, required: true },
    current_position: { type: Number, required: true },
  },
  { collection: 'racers',
    versionKey: false, // 👈 disables __v
  }
);

export type RacerType = InferSchemaType<typeof racerSchema> & { _id?: string };
export type RacerFormType = Omit<RacerType, 'race_id' | 'driver_id'> & { race_id: string, driver_id: string }; // Used on the client form
export const Racer = mongoose.models.Racer || model('Racer', racerSchema);