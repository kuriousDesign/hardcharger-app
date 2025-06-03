import mongoose from 'mongoose';
import { createModel } from '@/lib/createModel';

const schema = new mongoose.Schema(
  {
    user_id : { type: String, required: true }, // user id from the users collection from clerk
    number: { type: Number, required: false }, // e.g., 1, 2, 3, etc.
    //role: { type: String, required: true }, // e.g., 'admin', 'user', 'robot'
    private_games: { type: [mongoose.Schema.Types.ObjectId], required: true }, // array of private game ids the user can access

  },
  { collection: 'players',
    versionKey: false, // 👈 disables __v
   }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { model: model, types } = createModel('Player', schema);
export const PlayerModel = model;
export type PlayerDoc = typeof types.server;
export type PlayerClientType = typeof types.client;