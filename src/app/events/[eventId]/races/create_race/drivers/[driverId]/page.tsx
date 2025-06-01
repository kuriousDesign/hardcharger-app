import Link from "next/link";

export default async function DriverPage({
    params,
  }: {
    params: Promise<{ driverId: string; }>
  }) {
  const { driverId } = await params;

	//const events = await getEvents();

	return (
		<div className="p-6 space-y-4">
            {driverId}
            <Link
                href={`..`}
                className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
            >
                Back to Drivers
            </Link>
		</div>
	);
}