import mongoose from 'mongoose';
import { createModel } from '@/lib/createModel';

const driverSchema = new mongoose.Schema(
  {
    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    suffix: { type: String, required: false, trim: true, default: '' },
    car_number: { type: String, required: true },
  },
  {
    collection: 'drivers',
    versionKey: false,
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { model: Driver, types } = createModel('Driver', driverSchema);
export const DriverModel = Driver;
export type DriverDoc = typeof types.server;
export type DriverClientType = typeof types.client;