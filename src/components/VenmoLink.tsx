import { BiLogoVenmo } from "react-icons/bi";

const payToVenmoAccount = "gardner761";
export default function VenmoLink({ pickId, amount }: { pickId: string, amount: number}) {
    return(
        <a
            href={`https://venmo.com/?txn=pay&audience=private&recipients=${payToVenmoAccount}&amount=${amount}&note=${encodeURIComponent(`{pickId: ${pickId}}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 flex flex-row items-center justify-center transition-colors duration-300 shadow-md w-fit min-w-[150px]"
        >   
            <BiLogoVenmo className="mr-2 " />
            <p>Pay with Venmo</p>
        </a>
    );
}