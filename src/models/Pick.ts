import mongoose, { InferSchemaType, model } from 'mongoose';

const finisherSchema = new mongoose.Schema({
    racer_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    prediction: { type: Number, required: true }
});

const pickSchema = new mongoose.Schema(
  {
    nickname: { type: String, required: true },
    user_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    game_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    paid_status: { type: String, required: true }, //main, heat
    top_finishers: { type: [finisherSchema], required: true }, // array of topFinsher objects
    hard_chargers: { type: [finisherSchema], required: true }, 
    races: { type: [Number], required: true }, //array of race ids to include in the game
    first_transfer_position: { type: Number, required: true }, 
    intermission_lap: { type: Number, required: true }, 
  },
  { collection: 'picks',
    versionKey: false, // 👈 disables __v
   }
);

export type FinisherType = InferSchemaType<typeof finisherSchema>;
export type PickType = InferSchemaType<typeof pickSchema> & { _id?: string };
export type PickFormType = Omit<PickType, 'game_id' | 'user_id'> & { game_id: string, user_id: string }; // Used on the client form
export const Pick = mongoose.models.Pick || model('Pick', pickSchema);