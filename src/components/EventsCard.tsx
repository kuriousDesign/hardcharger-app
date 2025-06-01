import EventsDiv from "./EventsDiv";
import Link from "next/link";


export default async function EventsCard(){

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md gap-4">
            <h2 className="text-xl font-bold mb-4">Events</h2>
            <EventsDiv />
            <Link 
                href={`events/create_event`}
                className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
                Add Event
            </Link> 
        </div>
    );
};