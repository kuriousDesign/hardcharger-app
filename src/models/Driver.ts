import mongoose, { InferSchemaType, model } from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    suffix: { type: String, required: false, trim: true, default: '' },
    car_number: { type: String, required: true },
  },
  { collection: 'drivers',
    versionKey: false, // 👈 disables __v
  }
);

export type DriverType = InferSchemaType<typeof driverSchema> & { _id?: string };
export const Driver = mongoose.models.Driver || model('Driver', driverSchema);