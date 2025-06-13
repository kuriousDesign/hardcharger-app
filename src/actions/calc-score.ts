import { getDriver, getRacersByRaceId, getRacesByGameId, getGame, getPicksByGameId } from "@/actions/getActions";
import { GameClientType } from "@/models/Game";
import { PickClientType, DriverPredictionClientType } from "@/models/Pick";
import { RaceClientType } from "@/models/Race";
import { RacerClientType } from "@/models/Racer";
import { HardChargerLeaderboardEntry } from "@/components/tables/hard-charger-leaderboard";
import { DriverClientType } from "@/models/Driver";
import { getDriverFullName } from "@/types/helpers";
import { postGame, postPick } from "@/actions/postActions";


// calculate game results

// before this step someone has updated all the race finishing positions

function convertLetterToAscii(letter: string): number {
    if (letter.length !== 1 || !/^[A-Z]$/.test(letter)) {
        throw new Error("Invalid letter. Please provide a single uppercase letter A-Z.");
    }
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
}


// CALCULATE GAME RESULTS
export async function calculateHardChargersLeaderboardByGameId(gameId:string){
    const game = await getGame(gameId) as GameClientType;
    // 1. collect all races from the game
    const races = await getRacesByGameId(game._id as string) as RaceClientType[];
    const orderedRaceIds = [{}] as {id:string, letter?:string}[];
    
    // sort races by race letter. A first and then B and so on
    races.sort((a, b) => {
        const aLetter = a.letter ? convertLetterToAscii(a.letter) : 0; // default to 0 if letter is not defined
        const bLetter = b.letter ? convertLetterToAscii(b.letter) : 0; // default to 0 if letter is not defined
        return aLetter - bLetter;
    });

    //need a list of race ids with race letters
    races.map((race:RaceClientType) => {
        orderedRaceIds.push({
            id: race._id as string,
            letter: race.letter,
        });
    });


    
    // 3. collect all racers from the races
    const racers = [] as RacerClientType[];
    const hardChargerTable = [] as HardChargerLeaderboardEntry[];
    //const topFinisherTable = [] as RaceLeaderboardEntry[];
    const uniqueDrivers = [] as DriverClientType[];
    let raceAmainRacers = [] as RacerClientType[];
    races.map(async (race:RaceClientType) => {
        //await getRacersByRaceId(race._id as string);
        const raceRacers = await getRacersByRaceId(race._id as string);
        racers.push(...raceRacers);
        if (race.letter === 'A'){
            raceAmainRacers = raceRacers; // store A main racers for later use
            // sort by current_position
            raceAmainRacers.sort((a, b) => a.current_position - b.current_position);

        }
        // update unique driver ids
        raceRacers.map(async (racer:RacerClientType) => {
            if (racer.driver_id && !uniqueDrivers.find((driver) => driver._id === racer.driver_id)) {
                const driver = await getDriver(racer.driver_id as string);
                uniqueDrivers.push(driver);
            }
        });
    })

    // 4. calculate hard charger for each driver id (multiple racers with same driver_id) --> create a table object
    
    uniqueDrivers.forEach((driver:DriverClientType) => {
        // 4a. for each driver id, get all racers with that driver id

        const driverRacers = racers.filter((racer) => racer.driver_id && racer.driver_id === driver._id) as RacerClientType[];
        //if driverRacers is missing any races from orderedRaceIds, then we need to
        
        const carsPassedByRace = [] as number[];
        let totalCarsPassed = 0;
        // create the carsPassedByRace array with the same length as orderedRaceIds
        orderedRaceIds.forEach((raceIdObj) => {
            const racer = driverRacers.find((racer) => racer.race_id === raceIdObj.id);
            let carsPassed = 0;
            if(racer){
                carsPassed = racer.starting_position - racer.current_position; // assuming starting_position is greater than current_position
            }
            totalCarsPassed += carsPassed;
            carsPassedByRace.push(carsPassed);
        });
        const hardChargerEntry: HardChargerLeaderboardEntry = {
            _driver_id: driver._id as string,
            driver_name: getDriverFullName(driver),
            total_cars_passed: totalCarsPassed,
            cars_passed_by_race: carsPassedByRace,
            rank: 0, // will be calculated later
        }
        hardChargerTable.push(hardChargerEntry);
    });

    // 5. calculate ranks for hard charger table - first sort 
    hardChargerTable.sort((a, b) => b.total_cars_passed - a.total_cars_passed);
    hardChargerTable.forEach((entry, index) => {
        // if index is 0, then rank is 1, else if rank is same as previous, then rank is same as previous, else rank is index + 1
        if (index === 0) {
            entry.rank = 1;
        } else if (entry.total_cars_passed === hardChargerTable[index - 1].total_cars_passed) {
            entry.rank = hardChargerTable[index - 1].rank; // same rank as previous
        } else {
            entry.rank = index + 1; // rank is index + 1
        }
    });

        // 2. check if all races from the game are finished
    let allFinished = true;
    races.map((race:RaceClientType) => {
        if(race.status!=='finished'){
            allFinished=false;
            console.log("not all races are finished, this is just an update, not a final calculation");
 
        }
    })

    if (allFinished) {
        game.status = 'completed';
    }
    else {
        game.status = 'active'; // update the game status to just finished
    }
    await postGame(game); // update the game status

    return {hardChargerTable, raceAmainRacers};
}


export async function calculateHardChargerScoreForPicks(picks:PickClientType[], hardChargerTable:HardChargerLeaderboardEntry[],game:GameClientType) {

    picks.map((pick:PickClientType) => {
        const hardChargers = pick.hard_chargers;
        let totalScore = 0;
        //const driverChargers = [{}];
        hardChargers.map((hardCharger:DriverPredictionClientType) => {
            // find the hard charger entry in the hardChargerTable
            const hardChargerEntry = hardChargerTable.find((entry) => entry._driver_id === hardCharger.driver_id);
            if (hardChargerEntry) {
                // add the score based on the rank of the hard charger
                const score = calculateHardChargerScoreForDriver(hardChargerEntry.total_cars_passed, hardCharger.prediction,game);
                hardCharger.score = score; // set the score for the hard charger
                totalScore += score; // add the score to the total score
            }
        });
        pick.score_hard_chargers = totalScore; // set the total score for hard chargers
    });
}

export function calculateHardChargerScoreForDriver(carsPassed: number, prediction: number, game:GameClientType): number {
    // Calculate the score based on the number of cars passed and the prediction
    if (carsPassed > prediction) {
        return prediction; // More cars passed than predicted
    } else if (carsPassed <= 0) {
        return carsPassed; // No cars passed, no score
    } else if (carsPassed === prediction) {
        return prediction + game.hard_charger_prediction_bonus; // Exact match, full score
    }
    else {
        const diff = Math.abs(carsPassed - prediction);
        const penalty = prediction * game.hard_charger_prediction_scale * diff;
        return Math.max(0, prediction - penalty); // Apply penalty, ensure score is not negative
    }
}

export function calculateTopFinishersScoreForDriver(finishPosition: number, prediction: number, game:GameClientType): number {
    // Calculate the score based on the finish position and the prediction
    if (finishPosition === prediction) {
        return game.top_finisher_baseline_points + game.top_finisher_prediction_bonus; // Exact match, full score
    } else if (finishPosition <= 0) {
        return 0; // Invalid position, no score
    } else if (finishPosition > prediction) {
        const diff = Math.abs(finishPosition - prediction);
        const penalty = game.top_finisher_prediction_penalty * diff;
        return Math.max(0, 10 - penalty); // Apply penalty, ensure score is not negative
    } else {   
        const diff = Math.abs(finishPosition - prediction);
        const outperformBonus = game.top_finisher_prediction_penalty/2.0 * diff;
        return game.top_finisher_baseline_points + outperformBonus; // Outperforming the prediction, bonus score
    }
}

export async function calculateTopFinishersScoreForPicks(picks:PickClientType[], raceAmainRacers:RacerClientType[], game:GameClientType) {
    picks.map((pick:PickClientType) => {
        let totalScore = 0;
        pick.top_finishers.map((topFinisher:DriverPredictionClientType) => {
            // find the racer in the raceAmainRacers
            const racer = raceAmainRacers.find((racer) => racer.driver_id === topFinisher.driver_id);
            if (racer) {  
                // calculate the score for the top finisher
                const score = calculateTopFinishersScoreForDriver(racer.current_position, topFinisher.prediction, game);
                topFinisher.score = score; // set the score for the top finisher
                totalScore += score; // add the score to the total score
            }      
        });
        pick.score_top_finishers = totalScore; // set the total score for top finishers 
    });
}    

export async function updatePicksScoresByGame(gameId:string) {
    try {
        // 1. get all picks for the game
        const game = await getGame(gameId) as GameClientType;
        const picks = await getPicksByGameId(gameId) as PickClientType[];
        if (!picks || picks.length === 0) {
            console.log("No picks found for the game");
            return picks;
        }
        // 2. calculate hard charger leaderboard
        const {hardChargerTable, raceAmainRacers} = await calculateHardChargersLeaderboardByGameId(gameId);
        // 3. calculate hard charger scores for each pick, stores it to the pick itself
        await calculateHardChargerScoreForPicks(picks, hardChargerTable, game);
        // 4. calculate top finishers scores for each pick, stores it to the pick itself
        await calculateTopFinishersScoreForPicks(picks, raceAmainRacers, game);
        // 5. Calculate total score for each pick and update the status
        picks.map((pick:PickClientType) => {
            pick.score_total = pick.score_top_finishers + pick.score_hard_chargers;// + pick.score_tie_breaker;
            pick.status = 'score_updated'; // update the status to finished
        });
        // 6. save the picks with scores
        picks.map(async (pick:PickClientType) => {
        await postPick(pick); // update the picks
        });

        // sort picks by score_total
        picks.sort((a, b) => b.score_total - a.score_total);
        return picks;
    } catch (error) {
        console.error("Error calculating scores for picks:", error);
    }
}