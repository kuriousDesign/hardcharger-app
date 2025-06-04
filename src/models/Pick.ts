import mongoose, { InferSchemaType } from 'mongoose';
import { createModel } from '@/lib/createModel';

const racerPredictionSchema = new mongoose.Schema({
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
    name: { type: String, required: true }, // Your name, default is what is found in the user profile
    nickname: { type: String, required: true },
    player_id: { type: mongoose.Schema.Types.ObjectId, required: true }, //(not in form)
    game_id:  { type: mongoose.Schema.Types.ObjectId, required: true }, // (not in form)
    is_paid: { type: Boolean, default: false }, // Indicates if the pick has been paid out (not in form)
    top_finishers: { type: [racerPredictionSchema], required: true }, // array of topFinsher objects
    hard_chargers: { type: [racerPredictionSchema], required: true }, // array of hardCharger objects
    tie_breaker: { type: Object, required: true }, // the structure of this object can vary based on game type, e.g.
    outcome: { type: Object, required: true }, // Outcome object with status, message, and optional payout, calculated during game not in form
  },
  { collection: 'picks',
    versionKey: false, // 👈 disables __v
   }
);

export type RacerPredictionClientType = Omit<InferSchemaType<typeof racerPredictionSchema>, 'racer_id'> & { racer_id: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { model: model, types } = createModel('Pick', schema);
export const PickModel = model;
export type PickDoc = typeof types.server;
type PickClientTypeUnconverted = typeof types.client;
export type PickClientType = Omit<PickClientTypeUnconverted, 'hard_chargers' | 'top_finishers'> & {
  hard_chargers: RacerPredictionClientType[];
  top_finishers: RacerPredictionClientType[];
};

// export type PickType = InferSchemaType<typeof pickSchema> & { _id?: string };
// export type PickFormType = Omit<PickType, 'game_id' | 'user_id'> & { game_id: string, user_id: string }; // Used on the client form
// export const Pick = mongoose.models.Pick || model('Pick', pickSchema);