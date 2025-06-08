import { getRaces, getRacesByEventId } from "@/actions/getActions";
import { getLinks } from "@/lib/link-urls";
import { RaceClientType } from "@/models/Race";
import Link from "next/link";


export default async function RacesCard({ eventId }: { eventId: string }) {
    let races:RaceClientType[] = [];
    if (!eventId || eventId === "_") {
        races = await getRaces();
    } else {
        races = await getRacesByEventId(eventId);
    }

    if (!races) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md">
                {"loading races"}
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Races</h2>
            <div className="flex flex-wrap gap-4 pb-4">
                {races.map((race: RaceClientType) => (
                    <Link
                        href={getLinks().getRaceUrl(eventId, race._id as string)}
                        key={race._id}
                        className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-fit px-4"
                    >
                        <p className="font-bold">{race.letter} {race.type}</p>
                        <p className="font-medium">Laps: {race.laps}</p>
                        <p className="font-medium">Cars: {race.num_cars}</p>
                        <p className="font-medium">Status: {race.status}</p>
                    </Link>
                ))}
            </div>
            <Link
                href={getLinks().getCreateRaceUrl(eventId)}
                className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-800 transition-colors duration-300 shadow-md"
            >
                Create Race
            </Link>
        </div>
    );
};