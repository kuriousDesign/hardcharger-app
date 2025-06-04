//import Link from "next/link";
import ActiveGamesDiv from "./ActiveGamesDiv";

export default async function ActiveGamesCard(){

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md gap-4">
            <h2 className="text-xl font-bold mb-4">Active Games</h2>
            <ActiveGamesDiv /> 
        </div>
    );

};