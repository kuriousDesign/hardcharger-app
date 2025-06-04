import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { GameClientType } from "@/models/Game"
import { RaceClientType } from "@/models/Race"

export function GameDetails({ game, races }: { game: GameClientType, races: RaceClientType[] }) {

    if (!game || Object.keys(game).length === 0 || !races || races.length === 0) {
        return <div className="text-red-500">loading...</div>
    }

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
            className="w-full"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className='text-xl'>Game Overview</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        {`Choose ${game.num_top_finishers.toString()} top drivers who you think will finish in the top ${game.num_top_finishers.toString()} positions in the A main`}
                    </p>
                    <p>
                        {`Then Choose ${game.num_hard_chargers} hard chargers - drivers you think will pass the most cars the entire night`}
                    </p>
                    <p>
                        {`The scores from top finishers and hard chargers are added up to give you your final total`}
                    </p>
                    <p>
                        {tieBreakerString}
                    </p>
                    <p>
                        {`${raceList()} are included in this game.`}
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className='text-lg'>Scoring</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Low Score Wins! The scoring is based on a combination of the finishing positions of your top drivers
                        and the hard charger passing performance.
                    </p>
                    <p className='font-bold text-gray-400'>
                        Top Finishers Scoring
                    </p>
                    <p>
                        Add up the finishing positions of your selection.
                        The top three drivers&apos; finishing positions are summed up, and the hard charger score is calculated based on the number of cars passed.
                    </p>
                    <p className='font-bold text-gray-400'>
                        Top Finishers Scoring
                    </p>
                    <p className='font-bold text-gray-400'>
                        Top Finishers Scoring
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className='text-lg'>Payment and Payout</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
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