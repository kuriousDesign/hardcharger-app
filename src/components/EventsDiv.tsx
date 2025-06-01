import { getEvents } from "@/actions/action";
import { EventType as Event } from "@/models/Event";
import Link from "next/link";


export default async function DriversCard(){

    //const router = useRouter();
    const events = await getEvents();

    //if (loading) return <div>Loading...</div>;
    if (!events) return <div>Events not found</div>;


    return (
            <div className="grid grid-cols-1 gap-2 space-x-2 w-fit">
                {events?.map((event:Event) => (
                    <Link 
                        key={event._id} 
                        href={`events/${event._id}`}
                        className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-full px-4 flex items-center"
                    >
                        <div className='flex flex-col gap-2 justify-start'>
                            <p className="font-bold text-2xl">{event.name}</p>
                            <p className="font-bold text-gray-400">{event.location}</p>
                            <p className="font-bold text-gray-400">{event.date}</p>
                        </div>
                    </Link>
                ))}
            </div>
    );
}