import mongoose, { InferSchemaType } from 'mongoose';
import { createModel } from '@/lib/createModel';

const finisherSchema = new mongoose.Schema({
    racer_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    prediction: { type: Number, required: true }
});

export interface Outcome {
  status: string; // e.g., 'pending', 'won', 'lost', 'partial'
  message?: string; // Optional message for additional context
  payout?: number; // Optional payout amount if applicable
}

const schema = new mongoose.Schema(
  {
    nickname: { type: String, required: true },
    user_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    game_id:  { type: mongoose.Schema.Types.ObjectId, required: true },
    paid_status: { type: String, required: true }, //pending(default), paid, partial_paid, unpaid
    top_finishers: { type: [finisherSchema], required: true }, // array of topFinsher objects
    hard_chargers: { type: [finisherSchema], required: true }, 
    races: { type: [Number], required: true }, //array of race ids to include in the game
    first_transfer_position: { type: Number, required: true }, 
    intermission_lap: { type: Number, required: true },
    outcome: { type: Object, required: true }, // Outcome object with status, message, and optional payout
  },
  { collection: 'picks',
    versionKey: false, // 👈 disables __v
   }
);

export type FinisherType = InferSchemaType<typeof finisherSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { model: model, types } = createModel('Pick', schema);
export const PickModel = model;
export type PickDoc = typeof types.server;
export type PickClientType = typeof types.client;

// export type PickType = InferSchemaType<typeof pickSchema> & { _id?: string };
// export type PickFormType = Omit<PickType, 'game_id' | 'user_id'> & { game_id: string, user_id: string }; // Used on the client form
// export const Pick = mongoose.models.Pick || model('Pick', pickSchema);