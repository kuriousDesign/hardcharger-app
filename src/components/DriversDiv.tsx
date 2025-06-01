//'use server';
export const dynamic = 'force-dynamic';


import { getDrivers } from "@/actions/action";
import { DriverType as Driver } from "@/models/Driver";
import Link from "next/link";


export default async function DriversCard(){

    //const router = useRouter();
    const drivers = await getDrivers();

    //if (loading) return <div>Loading...</div>;
    if (!drivers) return <div>Drivers not found</div>;

    function getDriverFullName(driver: Driver): string {
        return driver? `${driver.first_name} ${driver.last_name} ${driver.suffix}` : '';
    }

    return (
            <div className="grid grid-cols-1 gap-2 space-x-2 w-fit">
                {drivers && drivers?.map((driver:Driver) => (
                    <Link 
                        key={driver._id} 
                        href={`drivers/${driver._id}`}
                        className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-fit px-4 flex items-center"
                    >
                        <div className='flex flex-row gap-2 justify-start'>
                            <p className="font-bold">{driver? getDriverFullName(driver) : ''}</p>
                            <p className="font-bold text-gray-400">{drivers? driver.car_number : ''}</p>
                        </div>
                    </Link>
                ))}
            </div>
    );
}