import { RaceType as Race } from "@/models/Race";
import { RacerType as Racer } from "@/models/Racer";
//import {DriverType as Driver} from "@/models/Driver";
import { getRace, getRacersWithDriversByRaceId } from "@/actions/action";
import Link from "next/link";


export default async function RacersCard({ eventId, raceId }: { eventId: string, raceId: string }){

    let racersTitle = 'Starting Lineup';


    // Replace with your actual API endpoint
    const race = await getRace(raceId) as Race;
    const {racers, drivers } = await getRacersWithDriversByRaceId(raceId as string);


    //console.log("status:", raceResult.status);
    if(!racers || racers.length === 0) {
        racersTitle = 'No Racers';
    }
    else if(race.status === 'finished' || race.status === 'in_progress') {
        racers.sort((a, b) => a.current_position - b.current_position);
        racersTitle='Current Standings';
        if(race.status === 'finished') {
            racersTitle='Final Results';
        }
    }
    else {
        racers.sort((a, b) => a.starting_position - b.starting_position);
    }

    if (!racers || !race || !drivers) return <div>Race not found</div>;

    function getDriverFullName(driverId: string): string {
        //console.log("getDriverFullName called with driver_id:", driver_id);
        const driver = drivers?.find(d => d._id? d._id.toString() === driverId : false);
        return driver ? `${driver.first_name} ${driver.last_name} ${driver.suffix}` : 'Unknown Driver';
    }
    function getDriverCarNumber(driverId: string): string {
        
        //console.log("getDriverCarNumber called with driver_id:", driverId);
        //console.log("drivers:", drivers);
        const driver = drivers?.find(d => d._id? d._id.toString() === driverId : false);
  
        if (driver) {
            //console.log(`Found driver: ${driver.first_name} ${driver.last_name}, Car Number: ${driver.car_number}`);
            return driver.car_number;
        }
        return 'Unknown Car Number';
    }


    const RacersDiv = () => {   
        return (
             <div className="grid grid-cols-2 gap-2 space-x-2 w-fit">
                {racers.map((racer:Racer) => (
                    <Link 
                        key={racer._id} 
                        className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-fit px-4"
                        href={`events/${eventId}/races/${raceId}/racers/${racer._id}`}
                    >
                        <p className="font-bold">{getDriverFullName(racer.driver_id.toString())}</p>
                        <p className="font-bold text-gray-400">{drivers? getDriverCarNumber(racer.driver_id.toString()) : ''}</p>
                        {race?.status.startsWith('lineup') && (
                            <p className="font-medium">Starting Position: {racer.starting_position}</p>
                        )}
                        
                        {race?.status === 'finished' && (
                            <>
                                <p className="font-medium">{racer.current_position} Place</p>
                                <p className="font-medium">Cars Passed: {racer.starting_position - racer.current_position}</p>
                            </>
                        )}
                        {race?.status === 'in_progress' && (
                            <p className="font-medium">Current Position: {racer.current_position}</p>
                        )}
                    </Link>
                ))}
            </div>
        );
    };  

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md gap-4">
            <h2 className="text-xl font-bold mb-4">{racersTitle}</h2>
            <RacersDiv />
            <Link 
                href={`events/${eventId}/races/${raceId}/racers/create_racer`}
                className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
                Add Racer
            </Link> 

        </div>
    );
};