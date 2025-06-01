import mongoose, { InferSchemaType, model } from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pick_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    transaction_id: { type: String, required: true }, //vendor specific
    amount: { type: Number, required: true },
  },
  { collection: 'payments',
    versionKey: false, // 👈 disables __v
  }
);

export type PaymentType = InferSchemaType<typeof paymentSchema> & { _id?: string };
export type PaymentFormType = Omit<PaymentType, 'pick_id'> & { pick_id: string }; // Used on the client form
export const Payment = mongoose.models.Payment || model('Payment', paymentSchema);