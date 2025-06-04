
import { DriverClientType, DriverDoc } from '@/models/Driver';
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


export function getDriverFullName(driver: DriverClientType | DriverDoc): string {
  return `${driver.first_name} ${driver.last_name}${driver.suffix ? ` ${driver.suffix}` : ''}`;
}