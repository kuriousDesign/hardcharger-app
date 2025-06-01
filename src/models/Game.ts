import mongoose, { InferSchemaType, model } from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    event_id: { type: String, required: true },
    entry_fee: { type: String, required: true }, //main, heat
    num_entries: { type: String, required: true }, // A, B, C, etc.
    num_hard_chargers: { type: Number, required: true },
    num_hard_chargers_predictions: { type: Number, required: true }, //number of hard chargers predictions
    num_top_finishers: { type: Number, required: true },
    num_top_finishers_predictions: { type: Number, required: true }, //number of hard chargers predictions
    races: { type: [Number], required: true }, //array of race ids to include in the game
    first_transfer_position: { type: Number, required: true }, 
    intermission_lap: { type: Number, required: true }, 
  },
  { collection: 'games',
    versionKey: false, // 👈 disables __v
   }
);
export type GameType = InferSchemaType<typeof gameSchema> & { _id?: string };
export const Game = mongoose.models.Game || model('Game', gameSchema);
