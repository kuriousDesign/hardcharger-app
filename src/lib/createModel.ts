import mongoose, { InferSchemaType, Model, Schema } from 'mongoose';
import { ToClient } from '@/types/helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createModel<T extends Schema<any>>(
  name: string,
  schema: T,
) {

  try {
    // add _id field and objectIdFields 
    type DocType = InferSchemaType<T> & { _id?: string };
    type ClientType = ToClient<DocType>;

    // Create or retrieve the model
    const model = mongoose.models[name] || mongoose.model(name, schema);

    return {
      model: model as Model<DocType>,
      schema,
      types: {
        server: {} as DocType, // Placeholder for type inference
        client: {} as ClientType, // Placeholder for type inference
      },
    };
  } catch (error) {
    console.error(`Error creating model ${name}:`, error);
    throw error; // Re-throw to catch in calling code
  }
}