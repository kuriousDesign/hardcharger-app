'use server'

import dbConnect from '@/lib/dbConnect';
import { DriverModel, DriverClientType, DriverDoc } from '@/models/Driver'
import { EventModel, EventClientType } from '@/models/Event';
import { GameModel, GameClientType, GameDoc } from '@/models/Game';
import { PaymentModel, PaymentDoc, PaymentClientType } from '@/models/Payment';
import { RaceModel, RaceDoc, RaceClientType } from '@/models/Race';

import { Types } from 'mongoose';

import { toClientObject } from '@/utils/mongooseHelpers';
import { adminRoleProtectedOptions, createDeleteHandler, createClientSafePostHandler } from '@/utils/actionHelpers';


// export const getDrivers = async () => {
//   await dbConnect();
//   const data = await DriverModel.find();
//   return data as DriverClientType[];
// }

// admin role protected
export const postDriver = createClientSafePostHandler<DriverClientType>(DriverModel, adminRoleProtectedOptions);
export const deleteDriver = createDeleteHandler<DriverDoc>(DriverModel, adminRoleProtectedOptions);
//export const postGame = createClientSafePostHandler<GameClientType>(GameModel, adminRoleProtectedOptions);
export const deleteGame = createDeleteHandler<GameDoc>(GameModel, adminRoleProtectedOptions);

export const postDriverLongForm = async (clientData: Partial<DriverClientType>) => {
  await dbConnect();

  try {
    if (clientData._id && clientData?._id !== '') {
      //update existing driver
      const result = await DriverModel.findByIdAndUpdate(clientData._id, clientData, { new: true });
      if (!result) {
        console.error(`Driver with ID ${clientData._id} not found`);
        throw new Error(`Driver with ID ${clientData._id} not found`);
      }
      return { message: 'Driver updated successfully' };
    } else {
      //create new driver
      const newDriver = new DriverModel(clientData);
      await newDriver.save();
      return { message: 'Driver created successfully' };
    }
  } catch (error) {
    console.error('Driver save error:', error);
    throw new Error('Failed to save driver');
  }
};


export const postEvent = async (event: Partial<EventClientType> & { _id?: string }) => {
  await dbConnect();

  const eventData = {
    name: event.name?.trim() || '',
    date: event.date || new Date(),
    location: event.location?.trim() || '',
  };

  try {
    if (event._id) {
      await EventModel.findByIdAndUpdate(event._id, eventData, { new: true });
      return { message: 'Event updated successfully' };
    } else {
      const newEvent = new EventModel(eventData);
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
  const gamesDocs = await GameModel.find({ event_id: new Types.ObjectId(eventId) });
  const games = gamesDocs.map(game => toClientObject<GameClientType>(game));
  return games;
}

export const postGame = async (game: Partial<GameDoc | GameClientType> & { _id?: string }) => {
  await dbConnect();
  
  const gameData = {
    name: game.name?.trim() || '',
    entry_fee: game.entry_fee || 0,
    num_picks: game.num_picks || 0,
    event_id: typeof(game.event_id) === 'string' ? new Types.ObjectId(game.event_id) : game.event_id,
  };

  try {
    if (game._id) {
      await GameModel.findByIdAndUpdate(game._id, gameData, { new: true });
      return { message: 'Game updated successfully' };
    } else {
      const newGame = new GameModel(gameData);
      await newGame.save();
      return { message: 'Game created successfully' };
    }
  } catch (error) {
    console.error('Game save error:', error);
    throw new Error('Failed to save game');
  }
}


export const postPayment = async (payment: Partial<PaymentClientType> & { _id?: string }) => {
  await dbConnect();
  let paymentData: Partial<PaymentDoc> = {};

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
      pick_id: new Types.ObjectId(payment.pick_id),
    };
  }

  try {
    if (payment._id && payment._id !== '') {
      if(Types.ObjectId.isValid(payment._id)) {
        await PaymentModel.findByIdAndUpdate(payment._id, paymentData, { new: true });
        console.log('Payment updated successfully');
      return { message: 'Payment updated successfully' };
      } else {
        console.error('paymentId is not a valid mongodb objectId:', payment._id);
        return { success: false, error: 'Invalid payment ID' };
      }
    } else {
      console.log('creating a new payment');
      const newPayment = new PaymentModel(paymentData);
      await newPayment.save();
      console.log('Payment created successfully');
      return { message: 'Payment created successfully' };
    }
  } catch (error: unknown) {
    console.error('Payment save error:', (error as Error).message);
    throw new Error(`Failed to save payment: ${(error as Error).message}`);
  }
};


export const postRace = async (race: Partial<RaceDoc | RaceClientType> & { _id?: string }) => {
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
      await RaceModel.findByIdAndUpdate(race._id, raceData, { new: true });
      return { message: 'Race updated successfully' };
    } else {
      const newRace = new RaceModel(raceData);
      await newRace.save();
      return { message: 'Race created successfully' };
    }
  } catch (error) {
    console.error('Race save error:', error);
    throw new Error('Failed to save race');
  }
}

