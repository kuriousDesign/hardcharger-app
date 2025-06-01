'use server'

import dbConnect from '@/lib/dbConnect';
import { Driver, DriverType } from '@/models/Driver'
import { Event, EventType } from '@/models/Event';
import { Game, GameType } from '@/models/Game';
import { Payment, PaymentType } from '@/models/Payment';
import { Race, RaceType } from '@/models/Race';
import { Racer, RacerType } from '@/models/Racer';
import { Types } from 'mongoose';

export const connectToDatabase = async () => {
  await dbConnect();    
}

export const getDrivers = async () => {
  await dbConnect();
  const data = await Driver.find();
  return data as DriverType[];
}

export const postDriver = async (driver: Partial<DriverType> & { _id?: string }) => {
  await dbConnect();

  const driverData = {
    first_name: driver.first_name?.trim() || '',
    last_name: driver.last_name?.trim() || '',
    suffix: driver.suffix?.trim() || '',
    car_number: driver.car_number?.trim() || '',
  };

  try {
    if (driver._id) {
      await Driver.findByIdAndUpdate(driver._id, driverData, { new: true });
      return { message: 'Driver updated successfully' };
    } else {
      const newDriver = new Driver(driverData);
      await newDriver.save();
      return { message: 'Driver created successfully' };
    }
  } catch (error) {
    console.error('Driver save error:', error);
    throw new Error('Failed to save driver');
  }
};

export const getEvents = async () => {
	await dbConnect();
	const data = await Event.find();
	return data;
}

export const postEvent = async (event: Partial<EventType> & { _id?: string }) => {
  await dbConnect();

  const eventData = {
    name: event.name?.trim() || '',
    date: event.date || new Date(),
    location: event.location?.trim() || '',
  };

  try {
    if (event._id) {
      await Event.findByIdAndUpdate(event._id, eventData, { new: true });
      return { message: 'Event updated successfully' };
    } else {
      const newEvent = new Event(eventData);
      await newEvent.save();
      return { message: 'Event created successfully' };
    }
  } catch (error) {
    console.error('Event save error:', error);
    throw new Error('Failed to save event');
  }
}

export const getGamesByEventId = async (eventId: string) => {
  await dbConnect();
  const games = await Game.find({ event_id: new Types.ObjectId(eventId) });
  return games as GameType[];
}

export const getPayments = async () => {
  await dbConnect();
  const data = await Payment.find();
  return data;
}

export const postPayment = async (payment: Partial<PaymentType> & { _id?: string }) => {
  await dbConnect();

  const paymentData = {
    amount: payment.amount,
    type: payment.type?.trim() || '',
    name: payment.name?.trim() || '',
    transaction_id: payment.transaction_id?.trim() || '',
  };

  try {
    if (payment._id) {
      await Payment.findByIdAndUpdate(payment._id, paymentData, { new: true });
      return { message: 'Payment updated successfully' };
    } else {
      const newPayment = new Payment(paymentData);
      await newPayment.save();
      return { message: 'Payment created successfully' };
    }
  } catch (error) {
    console.error('Payment save error:', error);
    throw new Error('Failed to save payment');
  }
}

export const getRacesByEventId = async (eventId: string) => {
  await dbConnect();
  const races = await Event.find({ event_id: new Types.ObjectId(eventId) });
  return races as RaceType[];
}

export const getRace = async (raceId: string) => {
  await dbConnect();
  const race = await Race.findById(new Types.ObjectId(raceId));
  if(race === null) {
    // trigger a 404 error
    console.error(`Race with ID ${raceId} not found`);
    throw new Error(`Race with ID ${raceId} not found`);
    return null;
  }
  return race as RaceType;
}

export const getRacersByRaceId = async (raceId: string) => {
  await dbConnect();
  const racers = await Racer.find({ race_id: new Types.ObjectId(raceId) });
  return racers as RacerType[];
}

export const getRacersWithDriversByRaceId = async (raceId: string) => {
  await dbConnect();
  const racers = await Racer.find({ race_id: new Types.ObjectId(raceId) });
  const driverIds = racers.map(racer => racer.driver_id);
  const drivers = await Driver.find({ _id: { $in: driverIds } });
  return { racers: racers, drivers: drivers } as {racers: RacerType[], drivers: DriverType[]};
}