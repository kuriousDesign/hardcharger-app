import { getRacesByEventId } from "@/actions/getActions";
import { RaceClientType as Race } from "@/models/Race";
import Link from "next/link";


export default async function RacesCard({ eventId }: { eventId: string }) {
    const data = await getRacesByEventId(eventId);
    // useEffect(() => {
    //     const loadData = async () => {
    //         const result = await fetchRacesByEvent(eventId);
    //         //console.log("Loaded races:", result);
    //         setData(result.toSorted((a, b) => a.letter.localeCompare(b.letter)));
    //     };
    //     loadData();

    // }, [eventId]);

    if (!data) {  
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
                {data?.map((race:Race) => (
                    <Link
                        href={`/events/${eventId}/races/${race._id}`}
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
                href={`/events/${eventId}/races/create_race`} 
                className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-800 transition-colors duration-300 shadow-md"
            >
                Create Race
            </Link> 
        </div>
    );
};