import { Types, Model } from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import { toClientObject } from '@/utils/mongooseHelpers';

import { Roles } from '@/types/globals';
import { checkRole } from './roles';

type HandlerOptions = {
  isRoleProtected?: boolean;
  role?: Roles;
};

export const adminRoleProtectedOptions = {
  isRoleProtected: true,
  role: 'admin' as Roles,
};

// GET one document (client-safe)
export const createClientSafeGetHandler = <ServerType, ClientType>(
  model: Model<ServerType>,
  options?: HandlerOptions
) => {
  return async (id: string): Promise<ClientType> => {
    await dbConnect();

    if (options?.isRoleProtected && options.role) {
      const allowed = await checkRole(options.role);
      if (!allowed) throw new Error('Unauthorized access');
    }

    const doc = await model.findById(new Types.ObjectId(id));
    if (!doc) throw new Error(`Document with ID ${id} not found`);

    return toClientObject<ClientType>(doc);
  };
};

// GET all documents (client-safe)
export const createClientSafeGetAllHandler = <ServerType, ClientType>(
  model: Model<ServerType>,
  options?: HandlerOptions
) => {
  return async (): Promise<ClientType[]> => {
    await dbConnect();

    if (options?.isRoleProtected && options.role) {
      const allowed = await checkRole(options.role);
      if (!allowed) throw new Error('Unauthorized access');
    }

    const docs = await model.find();
    return docs.map((doc) => toClientObject<ClientType>(doc));
  };
};

//this function has bad logic
export function toDocumentObject<T>(input: Partial<T>): Partial<T> {
  // Example conversion, extend for your schema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output: any = {};
  for (const key in input) {
    const val = input[key];
    if (typeof val === 'string' && Types.ObjectId.isValid(val)) {
      output[key] = new Types.ObjectId(val);
    } else if (Array.isArray(val)) {
      output[key] = val.map(v => (typeof v === 'string' && Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : v));
    } else {
      output[key] = val;
    }
  }
  return output;
}

export const createClientSafePostHandler = <T extends { _id?: string }>(
  model: Model<T>,
  options?: HandlerOptions
) => {
  return async (clientData: Partial<T>) => {
    await dbConnect();

    if (options?.isRoleProtected && options.role) {
      const allowed = await checkRole(options.role);
      if (!allowed) throw new Error('Unauthorized access');
    }

    const { _id, ...rest } = clientData;
    const serverData = toDocumentObject<T>(rest as Partial<T>);  // <-- cast here

    if (_id && _id !== '') {
      const updated = await model.findByIdAndUpdate(_id, { $set: serverData }, { new: true });
      if (!updated) throw new Error(`Document with ID ${_id} not found`);
      return { message: 'Updated successfully' };
    } else {
      const created = new model(serverData);
      await created.save();
      return { message: 'Created successfully' };
    }
  };
};

// DELETE
export const createDeleteHandler = <T extends { _id?: string }>(
  model: Model<T>,
  options?: HandlerOptions
) => {
  return async (id: string) => {
    await dbConnect();

    if (options?.isRoleProtected && options.role) {
      const allowed = await checkRole(options.role);
      if (!allowed) throw new Error('Unauthorized access');
    }

    const deleted = await model.findByIdAndDelete(new Types.ObjectId(id));
    if (!deleted) throw new Error(`Document with ID ${id} not found`);

    return { message: 'Deleted successfully' };
  };
};
