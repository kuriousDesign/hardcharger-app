"use server";

import connectToDb from '@/lib/db';

import { EventModel, EventDoc, EventClientType } from '@/models/Event';
import { GameModel, GameDoc, GameClientType, GamePicksClientType } from '@/models/Game';
import { PaymentModel, PaymentDoc, PaymentClientType } from '@/models/Payment';
import { PickModel, PickDoc, PickClientType } from '@/models/Pick';
import { PlayerModel, PlayerDoc, PlayerClientType } from '@/models/Player';
import { RaceModel, RaceDoc, RaceClientType } from '@/models/Race';
import { DriverModel, DriverDoc, DriverClientType } from '@/models/Driver';
import { RacerModel, RacerDoc, RacerClientType, RacerDriverClientType } from '@/models/Racer';


import { createClientSafeGetAllHandler, createClientSafeGetHandler, createDocumentGetHandler } from '@/utils/actionHelpers';
import { Types } from 'mongoose';
import { toClientObject } from '@/utils/mongooseHelpers';
import { postNewPlayerByUserId as createPlayerByUserId } from './postActions';
import { currentUser } from '@clerk/nextjs/server';

export const getConnectToDb = async () => {await connectToDb();}

export const getDriver = createClientSafeGetHandler<DriverDoc,DriverClientType>(DriverModel);
export const getDrivers = createClientSafeGetAllHandler<DriverDoc, DriverClientType>(DriverModel);
export const getEvent = createClientSafeGetHandler<EventDoc, EventClientType>(EventModel);
export const getEvents = createClientSafeGetAllHandler<EventDoc, EventClientType>(EventModel);
export const getGame = createClientSafeGetHandler<GameDoc,GameClientType>(GameModel);
export const getGameServer = createDocumentGetHandler<GameDoc>(GameModel);
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
  await connectToDb();
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
  await connectToDb();
  const docs = await GameModel.find({ event_id: new Types.ObjectId(eventId) });
  return docs.map((doc) => toClientObject<GameClientType>(doc));
}



export const getGamePicksByPlayerId = async (playerId: string): Promise<GamePicksClientType[]> => {
  await connectToDb();
  const gamePicks = [] as GamePicksClientType[];
  const filter = { player_id: new Types.ObjectId(playerId) };
  const picks = await getPicks(filter);
  const gameIds = Array.from(new Set(picks.map(pick => pick.game_id.toString())));
  // remove duplicates from gameIds
  const uniqueGameIds = Array.from(new Set(gameIds));
  
  if( uniqueGameIds.length === 0) {
    //console.warn(`No game IDs found for player ${playerId}`);
    return gamePicks; // Return empty array if no game IDs found
  }
  for (const gameId of uniqueGameIds) {
    const game = await getGame(gameId);
    if (game) {
      const gamePicksData: GamePicksClientType = {
        game: game as GameClientType,
        picks: picks.filter(pick => pick.game_id === gameId)
      };
      gamePicks.push(gamePicksData);
    } else {
      console.warn(`Game with ID ${gameId} not found for player ${playerId}`);
    }
  }
  return gamePicks;
}

export const getRacesByEventIdOld = async (eventId: string): Promise<RaceClientType[]> => {
  await connectToDb();
  const raceDocs = await RaceModel.find({ event_id: new Types.ObjectId(eventId) });
  const races = raceDocs.map((doc) => toClientObject<RaceClientType>(doc));
  return races;
};

export const getRacesByEventId = async (eventId: string): Promise<RaceClientType[]> => {
  const filter = { event_id: new Types.ObjectId(eventId) };
  const races = await getRaces(filter);
  return races as RaceClientType[];
  //console.log('getRacesByEventId',
}

export const getRacersByRaceId = async (raceId: string): Promise<RacerClientType[]>  => {
  const filter = { race_id: new Types.ObjectId(raceId) };
  const racers = await getRacers(filter);
  return racers;
}

export const getDriversNotInRace = async (raceId: string): Promise<DriverClientType[]>  => {
  const allDrivers = await getDrivers();
  const racers = await getRacersByRaceId(raceId);
  const racerDriverIds = new Set(racers.map(racer => racer.driver_id));
  const availableDrivers = allDrivers.filter(driver => driver._id && !racerDriverIds.has(driver._id.toString()));
  return availableDrivers as DriverClientType[];
};

export const getRacersWithDriversByRaceId = async (raceId: string): Promise<RacerDriverClientType[]>  => {

  const racers = await getRacersByRaceId(raceId);
  //console.log('getRacersWithDriversByRaceId', raceId, racers.length, racers);

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

  if (racerDrivers.length === 0) {
    console.warn('No racers found for game', gameId);
    return racerDrivers;
  }

  // get rid of multiple racers with the same driver or any driver where last_names starts with transfer
  const uniqueRacerDrivers = new Map<string, RacerDriverClientType>();
  for (const racerDriver of racerDrivers) {
    const driverId = racerDriver?.driver?._id ? racerDriver.driver._id : '';
    if (!uniqueRacerDrivers.has(driverId) && !racerDriver.driver.last_name.startsWith('Transfer')) {
      uniqueRacerDrivers.set(driverId, racerDriver);
    }
  }
  // Convert the map values back to an array
  racerDrivers.length = 0; // Clear the original array
  uniqueRacerDrivers.forEach((value) => {
    racerDrivers.push(value);
  });
  //console.log('getRacersWithDriversForPickCreation', racerDrivers);


  return racerDrivers as RacerDriverClientType[];
};


export const getPlayersByUserId = async (userId: string): Promise<PlayerClientType> => {
  const filter = { user_id: userId }; //in this case userId is saved as a string in the database
  let players = await getPlayers(filter);
  if (players.length === 0) {
    //throw new Error(`No player found with user_id: ${userId}`);
    console.warn(`No player found with user_id: ${userId}, creating a new player`);
    // If no player is found, create a new player
    await createPlayerByUserId(userId);
    players = await getPlayers(filter);
    if (players.length === 0) {
      throw new Error(`Failed to create player with user_id: ${userId}`);
    }
  }
  // Assuming user_id is unique, we take the first player
  const player = players[0]; // Assuming user_id is unique, we take the first player
  return player as PlayerClientType;
};

export const getCurrentPlayer = async (): Promise<PlayerClientType> => {
  const user = await currentUser();
  if (!user) {
    throw new Error(`No user found with user_id`);
  }
  const player = await getPlayersByUserId(user.id);
  if (!player) {
    throw new Error(`No player found for user_id: ${user.id}`);
  }
  return player as PlayerClientType;
};
export const getUserFullName = async (): Promise<string> => {
  const user = await currentUser();
  if (!user) {
    throw new Error(`No user found with user_id`);
  }
  const fullName = user.fullName || `${user.firstName} ${user.lastName}`;
  return fullName;
};

export const getPicksByGameId = async (gameId: string): Promise<PickClientType[]> => {
  const filter = { game_id: new Types.ObjectId(gameId) };
  const picks = await getPicks(filter);
  return picks as PickClientType[];
}

export const getRacesByGameId = async (gameId: string): Promise<RaceClientType[]> => {
  const game = await getGame(gameId) as GameClientType;
  // get all races in game.races array of ObjectId
  const races = [] as RaceClientType[];
  for (const raceId of game.races) {
    const race = await getRace(raceId);
    if (race) {
      races.push(race);
    }
  }
  return races;
}