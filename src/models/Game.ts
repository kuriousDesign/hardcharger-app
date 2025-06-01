import mongoose, { InferSchemaType, model } from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    event_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    entry_fee: { type: String, required: true }, //main, heat
    house_cut: { type: Number, required: true }, //percentage of entry fee that goes to the house
    purse_amount: { type: Number, required: true }, // total amount of money in the purse (picks * entry_fee)
    num_picks: { type: String, required: true }, // A, B, C, etc.
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
