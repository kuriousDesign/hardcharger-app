import mongoose from 'mongoose';
import { createModel } from '@/lib/createModel';


const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  races: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  entry_fee: { type: Number, required: true },
  house_cut: { type: Number, required: true },
  purse_amount: { type: Number, required: true },
  num_picks: { type: Number, required: true },
  num_hard_chargers: { type: Number, required: true },
  num_hard_chargers_predictions: { type: Number, required: true },
  num_top_finishers: { type: Number, required: true },
  num_top_finishers_predictions: { type: Number, required: true },
  is_private: { type: Boolean, required: false },
  password: { type: String, required: false },
}, {
  collection: 'games',
  versionKey: false
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { model: Game, types } = createModel('Game', gameSchema);
export const GameModel = Game;
export type GameDoc = typeof types.server;
export type GameClientType = typeof types.client;