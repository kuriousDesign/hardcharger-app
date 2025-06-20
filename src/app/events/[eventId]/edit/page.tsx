import { getEvent } from '@/actions/getActions';
import FormEvent from '@/components/forms/event';

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ eventId: string; }>
}) {
    const { eventId } = await params;
    const event = await getEvent(eventId);
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Create Event</h1>
            <FormEvent initialData={event}/>
        </div>
    );
}