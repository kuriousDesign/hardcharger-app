// Generic Factory for Models and Types

import mongoose, { InferSchemaType, Model, Schema } from 'mongoose';
import { ToClient } from '@/types/helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createModel<T extends Schema<any>>(
  name: string,
  schema: T,
) {

  // add _id field and objectIdFields 
  type DocType = InferSchemaType<T> & { _id?: string };
  type ClientType = ToClient<DocType>;

  const model = mongoose.models[name] || mongoose.model(name, schema);

  return {
    model: model as Model<DocType>,
    schema,
    types: {} as {
      server: DocType;
      client: ClientType;
    }
  };
}