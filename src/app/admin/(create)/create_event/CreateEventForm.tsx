'use client';

import { useState } from 'react';
import { EventClientType } from '@/models/Event';
import { postEvent } from '@/actions/postActions';
import { useRouter } from 'next/navigation';

export default function CreateEventForm() {
  const router = useRouter();
  const [form, setForm] = useState<EventClientType>({
    _id: '',
    name: '',
    date: '',
    location: '',
  } as EventClientType);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postEvent(form);
      console.log("CreateEventForm submitted:", form);
      router.push('/events'); // redirect after success
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Event Name"
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Event
      </button>
    </form>
  );
}
