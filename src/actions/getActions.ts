"use server";

import dbConnect from '@/lib/dbConnect';

import { EventModel, EventDoc, EventClientType } from '@/models/Event';
import { GameModel, GameDoc, GameClientType } from '@/models/Game';
import { PaymentModel, PaymentDoc, PaymentClientType } from '@/models/Payment';
import { PickModel, PickDoc, PickClientType } from '@/models/Pick';
import { PlayerModel, PlayerDoc, PlayerClientType } from '@/models/Player';
import { RaceModel, RaceDoc, RaceClientType } from '@/models/Race';
import { DriverModel, DriverDoc, DriverClientType } from '@/models/Driver';
import { RacerModel, RacerDoc, RacerClientType, RacerDriverClientType } from '@/models/Racer';


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

export const getGamesByStatus = async (status: string): Promise<GameClientType[]> => {
  const filter = { status: status };
  const games = getGames(filter);
  //console.log('getGamesByStatus', status, games);
  return games;
}

export const getGamesByEventId = async (eventId: string): Promise<GameClientType[]> => {
  await dbConnect();
  const docs = await GameModel.find({ event_id: new Types.ObjectId(eventId) });
  return docs.map((doc) => toClientObject<GameClientType>(doc));
  //return games;
}

export const getRacesByEventId = async (eventId: string): Promise<RaceClientType[]> => {
  await dbConnect();
  const raceDocs = await RaceModel.find({ event_id: new Types.ObjectId(eventId) });
  const races = raceDocs.map((doc) => toClientObject<RaceClientType>(doc));
  return races;
};


export const getRacersWithDriversByRaceId = async (raceId: string) => {
  // get racers by race ID
  const filter = {race_id: new Types.ObjectId(raceId)};
  const racers = await getRacers(filter);

  const racerDrivers = [] as RacerDriverClientType[];
  if (racers.length === 0) {
    console.warn('No racers found');
    return racerDrivers;
  }

  // get drivers for each racer
  for (const racer of racers) {
    // get driver by driver ID
    const driver = await getDriver(racer.driver_id);
    if (driver) {
      // Combine racer and driver into a single object
      racerDrivers.push({
        racer: racer as RacerClientType,
        driver: driver as DriverClientType
      });
    } else {
      console.warn(`Driver with ID ${racer.driver_id} not found for racer ${racer._id}`);
      throw new Error(`Driver with ID ${racer.driver_id} not found`);
    }
  }
  return racerDrivers as RacerDriverClientType[];
};

export const getRacersByRaceId = async (raceId: string) => {
  await dbConnect();
  const racerDocs = await RacerModel.find({ race_id: new Types.ObjectId(raceId) });
  const racers = racerDocs.map(doc => toClientObject<RacerClientType>(doc));
  return racers as RacerClientType[];
}

export const getPicksByPlayerId = async (playerId: string) => {
  const filter = { player_id: new Types.ObjectId(playerId) };
  return getPicks(filter);
}


export const getPicksWithGamesByPlayerId = async (playerId: string) => {
  const filter = { player_id: new Types.ObjectId(playerId) };
  const picks = await getPicks(filter);

  
  // Extract unique game IDs from picks
  const gameIds = Array.from(new Set(picks.map(pick => pick.game_id.toString())));
  // Fetch matching games
  const games = [] as GameClientType[];
  for (const gameId of gameIds) {
    const game = await getGame(gameId);
    if (game) {
      games.push(game);
    }
  }

  return {
    picks: picks,
    games: games,
  };
}
export const getPicksByPlayerIdAndGameStatus = async (playerId: string, gameStatus: string) => {
  const filter = {
    player_id: new Types.ObjectId(playerId),
    game_status: gameStatus
  };
  return getPicks(filter);
}

export const getRacersWithDriversForPickCreation = async (gameId: string) => {
  // gather all raceIds for the game
  const game = await getGame(gameId) as GameClientType;
  const raceIds = game.races;
  const racerDrivers = [] as RacerDriverClientType[];
  for (const raceId of raceIds) {
    const racerDriver = await getRacersWithDriversByRaceId(raceId);
    racerDrivers.push(...racerDriver);
  }
  return racerDrivers as RacerDriverClientType[];
};