import { CarouselDemo } from './CarouselDemo';
//import MultiStepPickForm from './MultiStepPickForm';

export default async function CreatePickPage({
  params,
}: {
  params: Promise<{ gameId: string; }>;
}) {
  const { gameId } = await params;
    if (!gameId ) {
        return <div className="p-6">
                nothing found
            </div>;
    }
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Create Pick</h1>
      {/* <MultiStepPickForm gameId={gameId} /> */}
      <CarouselDemo />
    </div>
  );
}