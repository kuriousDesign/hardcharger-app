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
    <div className="absolute top-0 left-0 flex flex-col gap-4 justify-center items-center w-full h-full p-4 bg-purple-400">
      <h1 className="text-2xl font-bold bg-amber-400">Create Pick</h1>
      {/* <MultiStepPickForm gameId={gameId} /> */}
      <CarouselDemo />
    </div>
  );
}