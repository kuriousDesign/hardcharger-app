'use server';
//export const dynamic = 'force-dynamic';

//import { useRouter } from "next/navigation";
import DriversDiv from "./DriversDiv";
import Link from "next/link";


export default async function DriversCard(){

    //const router = useRouter();

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md gap-4">
            <h2 className="text-xl font-bold mb-4">Drivers</h2>
            <DriversDiv />
            <Link 
                href={`drivers/create_driver`}
                className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
                Add Driver
            </Link> 
        </div>
    );
};