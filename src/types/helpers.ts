
import { Types } from 'mongoose';

/**
 * Recursively converts ObjectId and nested types to strings for client usage.
 */
export type ToClient<T> = {
  [K in keyof T]: T[K] extends Types.ObjectId
    ? string
    : T[K] extends Types.ObjectId[]
      ? string[]
      : T[K] extends object
        ? ToClient<T[K]>
        : T[K]
};
