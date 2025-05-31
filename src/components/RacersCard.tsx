"use client";

import { useEffect, useState } from "react";
import { fetchRace, fetchRacersWithDriversByRaceId} from "@/actions/actions";
import { Driver, Race, Racer } from "@/actions/models";
import router from "next/router";


export const RacersCard = ({ eventId, raceId }: { eventId: string, raceId: string })  => {
    const [race, setRace] = useState<Race | null>(null);
    const [racers, setRacers] = useState<Racer[] | null>(null);
    const [drivers, setDrivers] = useState<Driver[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [racersTitle, setRacersTitle] = useState( 'Starting Lineup');
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace with your actual API endpoint
                const raceResult = await fetchRace(raceId as string) as Race;
                const result = await fetchRacersWithDriversByRaceId(raceId as string);
                //console.log(result.drivers);
                
                setDrivers(result.drivers);
                setRace(raceResult);
                //console.log("status:", raceResult.status);
                if(result.racers.length === 0) {
                    setRacersTitle('No Racers');
                }
                else if(raceResult.status === 'finished' || raceResult.status === 'in_progress') {
                    result.racers.sort((a, b) => a.current_position - b.current_position);
                    setRacersTitle('Current Standings');
                    if(raceResult.status === 'finished') {
                        setRacersTitle('Final Results');
                    }
                }
                else {
                    result.racers.sort((a, b) => a.starting_position - b.starting_position);
                }

                setRacers(result.racers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false);
            }
        };
        if (raceId) {
            fetchData();
        }
    }, [raceId]);



    if (loading) return <div>Loading...</div>;
    if (!racers || !race || !drivers) return <div>Race not found</div>;

    function getDriverFullName(driver_id: string): string {
        //console.log("getDriverFullName called with driver_id:", driver_id);
        const driver = drivers?.find(d => d._id as string === driver_id as string);
        return driver ? `${driver.first_name} ${driver.last_name} ${driver.suffix}` : 'Unknown Driver';
    }
    function getDriverCarNumber(driver_id: string): string {
        
        //console.log("getDriverCarNumber called with driver_id:", driver_id);
        //console.log("drivers:", drivers);
        const driver = drivers?.find(d => d._id as string === driver_id as string);
  
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
                    <button 
                        key={racer._id} 
                        className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-fit px-4"
                        onClick={() => router.push(`event/${eventId}/race/${raceId}/racer/${racer._id}`)}
                    >
                        <p className="font-bold">{getDriverFullName(racer.driver_id)}</p>
                        <p className="font-bold text-gray-400">{drivers? getDriverCarNumber(racer.driver_id) : ''}</p>
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
                    </button>
                ))}
            </div>
        );
    };  

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md gap-4">
            <h2 className="text-xl font-bold mb-4">{racersTitle}</h2>
            {RacersDiv()}
            <button 
                onClick={() => router.push(`${window.location.pathname}/create_racer`)} 
                className="bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
                Add Racer
            </button> 

        </div>
    );
};