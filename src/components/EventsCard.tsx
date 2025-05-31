"use client"

import { useEffect, useState } from "react";
import { fetchEvents} from "@/actions/actions";
import { RaceEvent } from "@/actions/models";
import router from "next/router";
//import { useRouter } from "next/router"; // ✅ Pages Router



export const EventsCard = () => {
    //const router = useRouter();
    const [data, setData] = useState<RaceEvent[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    const loadData = async () => {
        try {
            // Fetch events from the server
            const result = await fetchEvents();
            //console.log("Loaded data:", result);
            setData(result);
        }
        catch (error) {
            console.error("Error loading events:", error);
        } finally {
            setLoading(false);
        }
    };
    loadData();

    }, []);

    const Events = () => {
        if (loading) return <div>Loading...</div>;
        if (!data || data.length === 0) return <div>No events found</div>;
        return (
            <div className="flex flex-wrap gap-4 pb-4">
                {data.map((event) => (
                    <button 
                        key={event._id} 
                        className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-full px-4"
                        onClick={() => router.push(`/event/${event._id}`)}
                    >
                        <p className="font-bold">{event.name}</p>
                        <p className="font-medium">{event.location}</p>
                        <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                    </button>
                ))}
            </div>
        );
    }
    
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-start space-y-4 items-start">
            <h2 className="text-xl font-bold mb-4">Events</h2>
            {Events()}
            <button 
                onClick={() => router.push('/create_event')} 
                className="bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
                Create Event
            </button>
        </div>
    );
};