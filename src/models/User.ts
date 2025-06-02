import { kStringMaxLength } from 'buffer';
import mongoose, { InferSchemaType, model } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true }, // e.g., 1, 2, 3, etc.
    email: { type: String, required: true }, // email of the user
    api_key: { type: kStringMaxLength, required: true },
    role: { type: String, required: true }, // e.g., 'admin', 'user', 'robot'
    private_games: { type: [mongoose.Schema.Types.ObjectId], required: true }, // array of private game ids the user can access

  },
  { collection: 'games',
    versionKey: false, // 👈 disables __v
   }
);

export type UserType = InferSchemaType<typeof userSchema> & { _id?: string };
export type UserFormType = Omit<UserType, 'private_games'> & { private_games: string[] }; // Used on the client form
export const User = mongoose.models.User || model('User', userSchema);