import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { GameClientType } from "@/models/Game"
import { RaceClientType } from "@/models/Race"
import { GameTypes, gameTypesToString } from "@/types/enums";

export function GameDetails({ game, races }: { game: GameClientType, races: RaceClientType[] }) {

    if (!game || Object.keys(game).length === 0 || !races || races.length === 0) {
        //return <div className="text-red-500">loading...</div>
    }
    //console.log('gametype', game.type);

    const tieBreakerString = game.tie_breaker ? `The tie breaker is ${game.tie_breaker.type}` : 'There is no tie breaker for this game';

    const raceList = () => {
        let output = '';
        let index = 0;
        if (races.length === 1) {
            output = races[0].letter + ' ' + races[0].type;
        }
        else {
            races.map((race: RaceClientType) => {
                index++;
                if (index === races.length) {
                    output = output.slice(0, -2) + ' and ' + race.letter + ' ' + race.type;
                }
                else {
                    output = output + race.letter + ', ';
                }
            })
        }

        return output;
    }

    return (
        <Accordion
            type="single"
            collapsible
            className="w-full h-full"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className='text-xl'>Game Overview</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        {`Choose ${game.num_top_finishers.toString()} top drivers who you think will finish in the top ${game.num_top_finishers.toString()} positions in the A main, order counts!`}
                    </p>
                    <p>
                        {`Then Choose ${game.num_hard_chargers} hard chargers - drivers you think will pass the most cars the entire night and predict exactly how many cars they will pass.`}
                    </p>
                    <p>
                        {`The scores from top finishers and hard chargers are added up to give you your final total. Penalty points are given if your predictions are inaccurate.`}
                    </p>
                    <p>
                        {tieBreakerString}
                    </p>
                    <p>
                        {`${raceList()} are included in this game.`}
                    </p>
                </AccordionContent>
            </AccordionItem>
            {(game.type === GameTypes.HYBRID || game.type === GameTypes.TOP_FINISHER) &&
                <AccordionItem value="item-3">
                    <AccordionTrigger className='text-xl'>Top Finishers Scoring</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">

                        <p>
                            Add up the finishing positions of your selection.
                            The top three drivers&apos; finishing positions are summed up, and the hard charger score is calculated based on the number of cars passed.
                        </p>
                        <p className='text-red-400'>
                            Prediction Penalty Points
                        </p>
                        <p>
                            {`You will predict the finishing positions of ${game.num_top_finishers_predictions} drivers. You automatically are awarded ${game.top_finisher_baseline_points} points for the driver. If they do not finish in the position you predicted, ${game.top_finisher_prediction_penalty} points will be added for each position you were off by. Penalty points will be capped at zero for each driver.`}
                        </p>
                    </AccordionContent>
                </AccordionItem>
            }
            {(game.type === GameTypes.HYBRID || game.type === GameTypes.HARD_CHARGER) &&
                <AccordionItem value="item-4">
                    <AccordionTrigger className='text-xl'>Hard Charger Scoring</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <div>
                            <p>{`You will select ${game.num_hard_chargers} drivers and predict how many cars they will pass over the course of the night. Only races designated in this game are included:`}</p>
                            <ul className="list-disc pl-6">
                                {races.map((race: RaceClientType, index: number) => (
                                    <li key={index}>{race.letter} {race.type}</li>
                                ))}
                            </ul>
                            <br />
                            <p> Scoring is based on the total number of cars passed, not race by race.</p>
                            <br />
                            <p> If more cars pass your driver than they pass, you lose a point per car. </p>
                            <br />
                            <p>If they don&apos;t not pass any cars, you will receive 0 points</p>
                            <br />


                            <div>If they pass more cars than pass them, you will receive points as follows:
                                <ul className="pl-6 space-y-1 list-disc">
                                    <li>they outperformed your prediction, you will only be credited with your prediction!</li>
                                    <li>your prediction was spot-on: you will receive a {game.hard_charger_prediction_bonus} bonus points in addition to the points you predicted</li>
                                    <li>they passed less than you predicted, penalty points will be removed from how many they actually passed! (see below)</li>
                                </ul>
                            </div>


                        </div>

                        <p className="font-light text-gray-400">
                            Example: if a fast driver starts in 4th in the B main and finishes 1st, they will get 3 points for the B main, and if they start in 17th in the A main and finish in 19th, they will get -2 points for the A main, for a total of 1 point.
                        </p>
                        <p className='text-red-400'>
                            Prediction Penalty Points
                        </p>
                        <p>
                            {`You will predict how many cars each driver will pass over the course of the night. If you are wrong, (${game.hard_charger_prediction_scale} x prediction) points will be added for every car you were off by. Your score for that driver will be the If penalty exceeds the number of cars passed, you will earn zero points.`}
                        </p>
                    </AccordionContent>
                </AccordionItem>
            }
            <AccordionItem value="item-5">
                <AccordionTrigger className='text-xl'>Payment and Payout</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance bg-gradient-to-b from-gray-50/50 to-white ">
                    <p className="font-bold text-lg">
                        {`$${game.entry_fee.toString()} entry fee per pick.`}
                    </p>
                    <p className='font-bold text-blue-400'>
                        Venmo is the preferred, plus the payment is automatically verified
                    </p>
                    <p>
                        Zelle or Cash is also accepted.
                    </p>
                    <p className='font-bold text-gray-300'>
                        {`The house will take a ${game.house_cut.toString()}% cut of the total pot, WebDev is not cheap`}
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}







// Hard Charger
// -1 point for every car passed, or one point added for every car that passes them. If you choose a driver outside of the A main, their hard charger score for each race will accumulate for the final score.
// Example: 
// David Gravel starts 6th in the B Main, finishes 3rd and transfer to A. That's -3 points from the B. In the A main he starts 19th and finishes in 12th, that's -7 points from the A. The total score is -10 points.

// Additionally, choose the finishing position of the hard charger. The difference between their actual position and predicted position will be added (penalized) to your score.

// Example, you predicted Schatz to be your hard charger and predicted that he would finish in 7th but he actually finished in 5th. You would be penalized 2 points. Same thing if he actually finished in 9th.

// If you choose a B main driver as your hard charger, you get the points from their B main race as well as points from the A. However, if the B main driver does not transfer to the A, no points will be rewarded to you.