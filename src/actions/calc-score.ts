'use server';

import { getDriver, getRacersByRaceId, getRacesByGameId, getGame, getPicksByGameId } from "@/actions/getActions";
import { GameClientType } from "@/models/Game";
import { PickClientType } from "@/models/Pick";
import { RaceClientType } from "@/models/Race";
import { RacerClientType } from "@/models/Racer";

import { DriverClientType } from "@/models/Driver";
import { getDriverFullName } from "@/types/helpers";
import { postGame, postPick } from "@/actions/postActions";
import { GameStates } from "@/types/enums";
import { HardChargerEntryClientType, HardChargerTableClientType } from "@/models/HardChargerTable";

// Convert letter to ASCII index
function convertLetterToAscii(letter: string): number {
    if (letter.length !== 1 || !/^[A-Z]$/.test(letter)) {
        throw new Error("Invalid letter. Please provide a single uppercase letter A-Z.");
    }
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
}

// Calculate hard chargers leaderboard
export async function calculateHardChargersLeaderboardByGameId(gameId: string) {
    //console.log('1. Collect game and races');
    const game = await getGame(gameId) as GameClientType;
    const races = await getRacesByGameId(game._id as string) as RaceClientType[];

    // Sort races by letter (A first, then B, etc.)
    races.sort((a, b) => {
        const aLetter = a.letter ? convertLetterToAscii(a.letter) : 0;
        const bLetter = b.letter ? convertLetterToAscii(b.letter) : 0;
        return aLetter - bLetter;
    });

    // Build ordered race IDs with letters
    const orderedRaceIds = races.map((race) => ({
        id: race._id as string,
        letter: race.letter,
    }));
    //console.log('Ordered race IDs:', orderedRaceIds);

    // Collect all racers and drivers
    //console.log('2. Collect racers and drivers');
    const racers: RacerClientType[] = [];
    let raceAmainRacers: RacerClientType[] = [];
    const driverMap = new Map<string, DriverClientType>(); // Map to store unique drivers by _id

    // Fetch racers for each race
    for (const race of races) {
        const raceRacers = await getRacersByRaceId(race._id as string);
        racers.push(...raceRacers);
        if (race.letter === 'A') {
            raceAmainRacers = raceRacers;
            raceAmainRacers.sort((a, b) => a.current_position - b.current_position);
        }

        // Fetch drivers for each racer
        for (const racer of raceRacers) {
            if (!driverMap.has(racer.driver_id)) {
                const driver = await getDriver(racer.driver_id as string);
                driverMap.set(racer.driver_id, driver);
            }
        }
    }
    const uniqueDrivers = Array.from(driverMap.values());
    //console.log('Unique drivers:', uniqueDrivers.map(d => ({ _id: d._id, name: getDriverFullName(d) })));

    // Calculate hard charger table
    //console.log('3. Calculate hard charger table');
    const entries: HardChargerEntryClientType[] = [];
    uniqueDrivers.forEach((driver) => {
        const driverRacers = racers.filter((racer) => racer.driver_id === driver._id);
        const carsPassedByRace: number[] = [];
        let totalCarsPassed = 0;

        // Calculate cars passed for each race
        orderedRaceIds.forEach((raceIdObj) => {
            const racer = driverRacers.find((racer) => racer.race_id === raceIdObj.id);
            const carsPassed = racer ? racer.starting_position - racer.current_position : 0;
            totalCarsPassed += carsPassed;
            carsPassedByRace.push(carsPassed);
        });

        const hardChargerEntry: HardChargerEntryClientType = {
            driver_id: driver._id as string,
            driver_name: getDriverFullName(driver),
            total_cars_passed: totalCarsPassed,
            cars_passed_by_race: carsPassedByRace,
            rank: 0,
        };
        entries.push(hardChargerEntry);
    });

    // Calculate ranks
    console.log('4. Assign ranks');
    entries.sort((a, b) => b.total_cars_passed - a.total_cars_passed);
    entries.forEach((entry, index) => {
        if (index === 0) {
            entry.rank = 1;
        } else if (entry.total_cars_passed === entries[index - 1].total_cars_passed) {
            entry.rank = entries[index - 1].rank;
        } else {
            entry.rank = index + 1;
        }
    });

    // Check if all races are finished
    console.log('5. Update game status');
    const allFinished = races.every((race) => race.status === 'finished');
    if (allFinished) {
        game.status = GameStates.FINISHED;
        console.log('All races finished, setting game status to FINISHED');
    } else {
        console.log('Not all races finished, game status unchanged');
    }
    await postGame(game);

    // Create hard charger table
    const hardChargerTable: HardChargerTableClientType = {
        game_id: gameId,
        entries: entries,
    };

    //console.log('Hard charger table:', hardChargerTable);
    return { hardChargerTable, raceAmainRacers };
}

// Calculate hard charger scores for picks
export async function calculateHardChargerScoreForPicks(picks: PickClientType[], hardChargerTable: HardChargerTableClientType, game: GameClientType): Promise<void> {
    for (const pick of picks) {
        let totalScore = 0;
        for (const hardCharger of pick.hard_chargers) {
            const hardChargerEntry = hardChargerTable.entries.find((entry) => entry.driver_id === hardCharger.driver_id);
            if (hardChargerEntry) {
                const score = await calculateHardChargerScoreForDriver(hardChargerEntry.total_cars_passed, hardCharger.prediction, game);
                hardCharger.score = score;
                totalScore += score;
            }
        }
        pick.score_hard_chargers = totalScore;
    }
}

// Calculate hard charger score for a driver
export async function calculateHardChargerScoreForDriver(carsPassed: number, prediction: number, game: GameClientType): Promise<number> {
    if (carsPassed > prediction) {
        return prediction;
    } else if (carsPassed <= 0) {
        return carsPassed;
    } else if (carsPassed === prediction) {
        return prediction + game.hard_charger_prediction_bonus;
    } else {
        const diff = Math.abs(carsPassed - prediction);
        const penalty = prediction * game.hard_charger_prediction_scale * diff;
        return Math.max(0, prediction - penalty);
    }
}

// Calculate top finishers score for a driver
export async function calculateTopFinishersScoreForDriver(finishPosition: number, prediction: number, game: GameClientType): Promise<number> {
    if (finishPosition === prediction) {
        return game.top_finisher_baseline_points + game.top_finisher_prediction_bonus;
    } else if (finishPosition <= 0) {
        return 0;
    } else if (finishPosition > prediction) {
        const diff = Math.abs(finishPosition - prediction);
        const penalty = game.top_finisher_prediction_penalty * diff;
        return Math.max(0, 10 - penalty);
    } else {
        const diff = Math.abs(finishPosition - prediction);
        const outperformBonus = game.top_finisher_prediction_penalty / 2.0 * diff;
        return game.top_finisher_baseline_points + outperformBonus;
    }
}

// Calculate top finishers scores for picks
export async function calculateTopFinishersScoreForPicks(picks: PickClientType[], raceAmainRacers: RacerClientType[], game: GameClientType): Promise<void> {
    for (const pick of picks) {
        let totalScore = 0;
        for (const topFinisher of pick.top_finishers) {
            const racer = raceAmainRacers.find((racer) => racer.driver_id === topFinisher.driver_id);
            if (racer) {
                const score = await calculateTopFinishersScoreForDriver(racer.current_position, topFinisher.prediction, game);
                topFinisher.score = score;
                totalScore += score;
            }
        }
        pick.score_top_finishers = totalScore;
    }
}
// Update picks scores by game
export async function updatePicksScoresByGame(gameId: string) {
    try {
        const game = await getGame(gameId) as GameClientType;
        const picks = await getPicksByGameId(gameId) as PickClientType[];
        if (!picks || picks.length === 0) {
            console.log("No picks found for the game");
            return picks;
        }
        const { hardChargerTable, raceAmainRacers } = await calculateHardChargersLeaderboardByGameId(gameId);
        console.log("2. Hard charger leaderboard calculated", hardChargerTable);
        await calculateHardChargerScoreForPicks(picks, hardChargerTable, game);
        await calculateTopFinishersScoreForPicks(picks, raceAmainRacers, game);
        picks.map((pick: PickClientType) => {
            pick.score_total = pick.score_top_finishers + pick.score_hard_chargers;
            pick.status = 'score_updated';
        });
        await Promise.all(picks.map((pick) => postPick(pick)));
        picks.sort((a, b) => b.score_total - a.score_total);
        return picks;
    } catch (error) {
        console.error("Error calculating scores for picks:", error);
    }
}