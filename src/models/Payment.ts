import mongoose, { InferSchemaType, model } from 'mongoose';

const paymentScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    transaction_id: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { collection: 'payments',
    versionKey: false, // 👈 disables __v
  }
);

export type PaymentType = InferSchemaType<typeof paymentScheme> & { _id?: string };

export const Payment = mongoose.models.Payment || model('Payment', paymentScheme);