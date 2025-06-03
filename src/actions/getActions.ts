"use server";

import dbConnect from '@/lib/dbConnect';

import { EventModel, EventDoc, EventClientType } from '@/models/Event';
import { GameModel, GameDoc, GameClientType } from '@/models/Game';
import { PaymentModel, PaymentDoc, PaymentClientType } from '@/models/Payment';
import { PickModel, PickDoc, PickClientType } from '@/models/Pick';
import { PlayerModel, PlayerDoc, PlayerClientType } from '@/models/Player';
import { RaceModel, RaceDoc, RaceClientType } from '@/models/Race';
import { DriverModel, DriverDoc, DriverClientType } from '@/models/Driver';
import { RacerModel, RacerDoc, RacerClientType } from '@/models/Racer';


import { createClientSafeGetAllHandler, createClientSafeGetHandler } from '@/utils/actionHelpers';
import { Types } from 'mongoose';
import { toClientObject } from '@/utils/mongooseHelpers';


export const connectToDatabase = async () => {await dbConnect();}

export const getDriver = createClientSafeGetHandler<DriverDoc,DriverClientType>(DriverModel);
export const getDrivers = createClientSafeGetAllHandler<DriverDoc, DriverClientType>(DriverModel);
export const getEvent = createClientSafeGetHandler<EventDoc, EventClientType>(EventModel);
export const getEvents = createClientSafeGetAllHandler<EventDoc, EventClientType>(EventModel);
export const getGame = createClientSafeGetHandler<GameDoc,GameClientType>(GameModel);
export const getGames = createClientSafeGetAllHandler<GameDoc, GameClientType>(GameModel);
export const getPayment = createClientSafeGetHandler<PaymentDoc, PaymentClientType>(PaymentModel);
export const getPayments = createClientSafeGetAllHandler<PaymentDoc, PaymentClientType>(PaymentModel);
export const getPick = createClientSafeGetHandler<PickDoc, PickClientType>(PickModel);
export const getPicks = createClientSafeGetAllHandler<PickDoc, PickClientType>(PickModel);
export const getPlayer = createClientSafeGetHandler<PlayerDoc, PlayerClientType>(PlayerModel);
export const getPlayers = createClientSafeGetAllHandler<PlayerDoc, PlayerClientType>(PlayerModel);
export const getRace = createClientSafeGetHandler<RaceDoc, RaceClientType>(RaceModel);
export const getRaces = createClientSafeGetAllHandler<RaceDoc, RaceClientType>(RaceModel);
export const getRacer = createClientSafeGetHandler<RacerDoc, RacerClientType>(RacerModel);
export const getRacers = createClientSafeGetAllHandler<RacerDoc, RacerClientType>(RacerModel);


// this will retrieve the game info from mongoDB and return the game object with the event info 
export const getGameWithEvent = async (gameId: string) => {
  await dbConnect();
  const game = await getGame(gameId);
  const event = await getEvent(game.event_id);
  const data = {
    game: game as GameClientType,
    event: event as EventClientType,
  };

  return data;
};

export const getRacesByEventId = async (eventId: string): Promise<RaceClientType[]> => {
  await dbConnect();
  const raceDocs = await RaceModel.find({ event_id: new Types.ObjectId(eventId) });
  const races = raceDocs.map((doc) => toClientObject<RaceClientType>(doc));
  return races;
};


export const getRacersWithDriversByRaceId = async (raceId: string) => {
  await dbConnect();

  // Fetch racers by race ID
  const racerDocs = await RacerModel.find({ race_id: new Types.ObjectId(raceId) });
  const racers: RacerClientType[] = racerDocs.map(doc => toClientObject<RacerClientType>(doc));

  // Extract driver IDs from racers
  const driverIds = racerDocs.map(racer => racer.driver_id);

  // Fetch matching drivers
  const driverDocs = await DriverModel.find({
    _id: { $in: driverIds }
  }) as DriverDoc[];

  // Convert driver documents to client-safe objects
  const drivers: DriverClientType[] = driverDocs.map(doc => toClientObject<DriverClientType>(doc));

  return {
    racers,
    drivers
  } as {
    racers: RacerClientType[],
    drivers: DriverClientType[]
  };
};

export const getRacersByRaceId = async (raceId: string) => {
  await dbConnect();
  const racerDocs = await RacerModel.find({ race_id: new Types.ObjectId(raceId) });
  const racers = racerDocs.map(doc => toClientObject<RacerClientType>(doc));
  return racers as RacerClientType[];
}
