
const payToVenmoAccount = "gardner761";
export default function VenmoLink({ pickId }: { pickId: string}) {
    return(
        <a
            href={`https://venmo.com/?txn=pay&audience=private&recipients=${payToVenmoAccount}&note=${encodeURIComponent(`{hardCharger: ${pickId}}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
        >
            Pay via Venmo
        </a>
    );
}