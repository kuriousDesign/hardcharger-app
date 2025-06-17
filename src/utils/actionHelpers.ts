import { Types, Model, FilterQuery } from 'mongoose';
import connectToDb from '@/lib/db';
import { toClientObject } from '@/utils/mongooseHelpers';

import { Roles } from '@/types/globals';
import { getRole } from './roles';


type HandlerOptions = {
  isRoleProtected?: boolean;
  role?: Roles;
};

export const adminRoleProtectedOptions = {
  isRoleProtected: true,
  role: 'admin' as Roles,
};

function checkRoleProtected(options?: HandlerOptions) {
  return async () => {
    if (options?.isRoleProtected && options.role) {
      const allowed = await getRole(options.role);
      if (!allowed) {
        throw new Error('Unauthorized access');
      }
    }
    return true;
  };
}

// GET one document (client-safe)
export const createClientSafeGetHandler = <ServerType, ClientType>(
  model: Model<ServerType>,
  options?: HandlerOptions
) => {
  return async (id: string): Promise<ClientType> => {
    await checkRoleProtected(options)();
    await connectToDb();
    const doc = await model.findById(new Types.ObjectId(id));
    if (!doc) throw new Error(`Document with ID ${id} not found`);

    return toClientObject<ClientType>(doc);
  };
};

export const createDocumentGetHandler = <ServerType>(
  model: Model<ServerType>,
  options?: HandlerOptions
) => {
  return async (id: string): Promise<ServerType> => {
    await checkRoleProtected(options)();
    await connectToDb();
    const doc = await model.findById(new Types.ObjectId(id));
    if (!doc) throw new Error(`Document with ID ${id} not found`);
    return doc;
  };
};

// GET all documents (client-safe)
export const createClientSafeGetAllHandler = <ServerType, ClientType>(
  model: Model<ServerType>,
  options?: HandlerOptions
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (filter?:FilterQuery<any>): Promise<ClientType[]> => {
    await checkRoleProtected(options)();
    await connectToDb();
    let docs;
    if(filter) {
      docs = await model.find(filter);
    }
    else {
      docs = await model.find();
    }

    return docs.map((doc) => toClientObject<ClientType>(doc));
  };
};

// GET all documents (server-side)
export const createDocumentGetAllHandler = <ServerType>(
  model: Model<ServerType>,
  options?: HandlerOptions
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (filter:FilterQuery<any>): Promise<ServerType[]> => {
    await checkRoleProtected(options)();
    await connectToDb();
    let docs;
    if(filter) {
      docs = await model.find(filter);
    }
    else {
      docs = await model.find();
    }
    return docs;
  };
}

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
    await checkRoleProtected(options)();
    await connectToDb();
    const { _id, ...rest } = clientData;
    const serverData = toDocumentObject<T>(rest as Partial<T>);  // <-- cast here

    if (_id && _id !== '') {
      const updated = await model.findByIdAndUpdate(_id, { $set: serverData }, { new: true });
      if (!updated) throw new Error(`Document with ID ${_id} not found`);
      //return { message: 'Updated successfully' };
      return toClientObject(updated);
    } else {
      const created = new model(serverData);
      await created.save();
      return toClientObject(created);
    }
  };
};

// DELETE
export const createDeleteHandler = <T extends { _id?: string }>(
  model: Model<T>,
  options?: HandlerOptions
) => {
  return async (id: string) => {
    await checkRoleProtected(options)();
    await connectToDb();
    const deleted = await model.findByIdAndDelete(new Types.ObjectId(id));
    if (!deleted) throw new Error(`Document with ID ${id} not found`);

    return { message: 'Deleted successfully' };
  };
};
