'use client';

import { useState } from 'react';
import { RaceType } from '@/models/Race';
import { postRace } from '@/actions/action';
import { useRouter } from 'next/navigation';
import { Types } from 'mongoose';

export default function CreateRaceForm({eventId}: { eventId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<RaceType>({
    _id: '',
    letter: '',
    type: '',
    laps: 0,
    num_cars: 0,
    event_id: new Types.ObjectId(eventId), // Ensure eventId is a valid ObjectId
    status: 'lineup', // default status
    num_transfers: 0,
    first_transfer_position: 0,
    intermission_lap: 0,
  } as RaceType);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postRace(form);
      console.log("CreateRaceForm submitted:", form);
      router.push('../');
        } catch (error) {
      console.error('Error creating race:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        name="letter"
        value={form.letter}
        onChange={handleChange}
        placeholder="Race Letter (e.g.,,A, B, C)"
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Race Type (e.g.,,Main, Heat)"
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="laps"
        value={form.laps}
        onChange={handleChange}
        placeholder="Number of Laps"
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="num_cars"
        value={form.num_cars}
        onChange={handleChange}
        placeholder="Number of Cars"
        className="border p-2 rounded"
        required
      />

      {/* <input
        type="text"
        name="event_id"
        value={form.event_id}
        onChange={handleChange}
        placeholder="Event ID"
        className="border p-2 rounded"
        required
      /> */}
      {/* <input
        type="text"
        name="_id"
        value={form._id}
        onChange={handleChange}
        placeholder="id (optional)"
        className="border p-2 rounded"
        required
      /> */}
      <input
        type="number"
        name="intermission_lap"
        value={form.intermission_lap}
        onChange={handleChange}
        placeholder="Intermission Lap (put 0 if there isn't one)"
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="num_transfers"
        value={form.num_transfers}
        onChange={handleChange}
        placeholder="Number of Transfers"
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="first_transfer_position"
        value={form.first_transfer_position}
        onChange={handleChange}
        placeholder="First Transfer Position"
        className="border p-2 rounded"
        required
      />
      {/* <input
        type="text"
        name="status"
        value={form.status}
        onChange={handleChange}
        placeholder="Status (e.g., lineup, in_progress, finished)"
        className="border p-2 rounded"
        required
      />       */}


      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Race
      </button>
    </form>
  );
}
