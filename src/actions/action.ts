'use server'

import dbConnect from '@/lib/dbConnect';
import { Driver, DriverType } from '@/models/Driver'
import { Event, EventType } from '@/models/Event';
import { Game, GameFormType, GameType } from '@/models/Game';
import { Payment, PaymentFormType, PaymentType } from '@/models/Payment';
import { Race, RaceFormType, RaceType } from '@/models/Race';
import { Racer, RacerType } from '@/models/Racer';
import { Types } from 'mongoose';

import { toFormObject } from '@/utils/mongooseHelpers';

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

export const getEvent = async (eventId:string) => {
  await dbConnect();
  const data = await Event.findById(new Types.ObjectId(eventId));
  if (data === null) {
    // trigger a 404 error
    console.error(`Event with ID ${eventId} not found`);
    throw new Error(`Event with ID ${eventId} not found`);
    return null;
  }
  return data as EventType;
}

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

export const postGame = async (game: Partial<GameType | GameFormType> & { _id?: string }) => {
  await dbConnect();
  
  const gameData = {
    name: game.name?.trim() || '',
    entry_fee: game.entry_fee || 0,
    num_picks: game.num_picks || 0,
    event_id: typeof(game.event_id) === 'string' ? new Types.ObjectId(game.event_id) : game.event_id,
  };

  try {
    if (game._id) {
      await Game.findByIdAndUpdate(game._id, gameData, { new: true });
      return { message: 'Game updated successfully' };
    } else {
      const newGame = new Game(gameData);
      await newGame.save();
      return { message: 'Game created successfully' };
    }
  } catch (error) {
    console.error('Game save error:', error);
    throw new Error('Failed to save game');
  }
}

export const getPayments = async () => {
  await dbConnect();
  const data = await Payment.find();
  return data;
}

export const postPayment = async (payment: Partial<PaymentFormType> & { _id?: string }) => {
  await dbConnect();
  let paymentData: Partial<PaymentType> = {};

  if (typeof payment.amount !== 'number') {
    console.error('Invalid payment amount:', payment.amount);
    return { success: false, error: 'Invalid payment amount' };
  }
  else if (!payment.pick_id || payment.pick_id === '') {
    console.error('Empty pick_id:', payment.pick_id);
    return { success: false, error: 'Empty pick_id' };
  } else if (!Types.ObjectId.isValid(payment.pick_id)) {
    console.error('Invalid pick_id:', payment.pick_id);
    return { success: false, error: 'Invalid pick_id' };
  } else {

    paymentData = {
      amount: typeof payment.amount === 'number' ? payment.amount : 0,
      type: payment.type?.trim() || '',
      name: payment.name?.trim() || '',
      transaction_id: payment.transaction_id?.trim() || '',
    };
  }

  try {
    if (payment._id && payment._id !== '') {
      if(Types.ObjectId.isValid(payment._id)) {
        // update an existing payment
        paymentData.pick_id = new Types.ObjectId(payment.pick_id);
        await Payment.findByIdAndUpdate(payment._id, paymentData, { new: true });
        console.log('Payment updated successfully');
      return { message: 'Payment updated successfully' };
      } else {
        console.error('paymentId is not a valid mongodb objectId:', payment._id);
        return { success: false, error: 'Invalid payment ID' };
      }
    } else {
      // create a new payment
      const newPayment = new Payment(paymentData);
      await newPayment.save();
      console.log('Payment created successfully');
      return { message: 'Payment created successfully' };
    }
  } catch (error: unknown) {
    console.error('Payment save error:', (error as Error).message);
    throw new Error(`Failed to save payment: ${(error as Error).message}`);
  }
};

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

// export const getRacesByEventId = async (eventId: string) => {
//   await dbConnect();
//   //console.log("getRacesByEvent: eventId:", eventId)
//   const races = await Race.find({ event_id: new Types.ObjectId(eventId) });
//   //console.log("getRacesByEvent: races found:", races)
//   return races as RaceFormType[];
// }


export const getRacesByEventId = async (eventId: string): Promise<RaceFormType[]> => {
  await dbConnect();
  const races = await Race.find({ event_id: new Types.ObjectId(eventId) });

  return toFormObject<RaceFormType[]>(races);
};

export const postRace = async (race: Partial<RaceType | RaceFormType> & { _id?: string }) => {
  await dbConnect();

  // check if event_id is a valid ObjectId, if its a string then convert it
  if (typeof(race.event_id) === 'string') {
    race.event_id = new Types.ObjectId(race.event_id as string);
  } 

  const raceData = {
    letter: race.letter?.trim() || '',
    type: race.type?.trim() || '',
    event_id: race.event_id,
    status: race.status?.trim() || 'lineup', // default status
    num_cars: race.num_cars || 0,
    laps: race.laps || 0,
    num_transfers: race.num_transfers || 0,
    first_transfer_position: race.first_transfer_position || 0,
    intermission_lap: race.intermission_lap || 0,
  };

  try {
    if (race._id) {
      await Race.findByIdAndUpdate(race._id, raceData, { new: true });
      return { message: 'Race updated successfully' };
    } else {
      const newRace = new Race(raceData);
      await newRace.save();
      return { message: 'Race created successfully' };
    }
  } catch (error) {
    console.error('Race save error:', error);
    throw new Error('Failed to save race');
  }
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
  //console.log("getRacersWithDriversByRaceId: raceId:", raceId, "driverIds:", driverIds);
  const drivers = await Driver.find({ _id: { $in: driverIds } }) as DriverType[];
  //console.log("getRacersWithDriversByRaceId: drivers found:", drivers);
  return { racers: racers, drivers: drivers } as {racers: RacerType[], drivers: DriverType[]};
}