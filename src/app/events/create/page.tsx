import CreateEventForm from '../../../components/forms/CreateEventForm';

export default async function CreateEventPage() {

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Race</h1>
      <CreateEventForm />
    </div>
  );
}