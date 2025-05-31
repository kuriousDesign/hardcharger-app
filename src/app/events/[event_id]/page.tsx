import Link from "next/link";

export default async function EventPage({
  params,
}: {
  params: Promise<{ event_id: string; }>
}) {
  const { event_id } = await params

	//const events = await getEvents();

	return (
		<div className="p-6 space-y-4">
            {event_id}
			<Link
				href={`/drivers`}
				className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
			>
				Back to Events
			</Link>
		</div>
	);
}
