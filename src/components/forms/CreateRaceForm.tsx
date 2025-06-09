'use client';

import { useState } from 'react';
import { RaceClientType } from '@/models/Race';
import { postRace } from '@/actions/postActions';
import { useRouter } from 'next/navigation';
import { getLinks } from '@/lib/link-urls';

export default function CreateRaceForm({eventId, redirectUrl}: { eventId: string, redirectUrl?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<RaceClientType>({
    _id: '',
    letter: '',
    type: '',
    laps: 0,
    num_cars: 0,
    event_id: eventId, // Ensure eventId is a valid ObjectId
    status: 'lineup', // default status
    num_transfers: 0,
    first_transfer_position: 0,
    intermission_lap: 0,
  } as RaceClientType);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postRace(form);
      console.log("CreateRaceForm submitted:", form);
      router.push(redirectUrl || getLinks().getRacesByEventUrl(eventId));
        } catch (error) {
      console.error('Error creating race:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label htmlFor="type" className="block mb-1 font-medium">Type</label>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Race Type</option>
          <option value="Main">Main</option>
          <option value="Heat">Heat</option>
        </select>
      </div>

      <div>
        <label htmlFor='letter' className="block mb-1 font-medium">{`${form.type} Identifier`}</label>
        <input
          id="letter"
          type="text"
          name="letter"
          value={form.letter}
          onChange={handleChange}
          placeholder="e.g., A, B, C or 1, 2, 3"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="laps" className="block mb-1 font-medium">Number of Laps</label>
        <input
          id="laps"
          type="number"
          name="laps"
          value={form.laps}
          onChange={handleChange}
          placeholder="0"
          className="border p-2 rounded w-full"
          min={1}
          max={100} // Assuming a maximum of 100 cars, adjust as needed
          required
        />
      </div>

      <div>
        <label htmlFor="num_cars" className="block mb-1 font-medium">Number of Cars</label>
        <input
          id="num_cars"
          type="number"
          name="num_cars"
          value={form.num_cars}
          onChange={handleChange}
          placeholder="0"
          className="border p-2 rounded w-full"
          min={1}
          max={100} // Assuming a maximum of 100 cars, adjust as needed
          required
        />
      </div>


      <div>
        <label htmlFor="num_transfers" className="block mb-1 font-medium">Number of Transfers</label>
        <input
          id="num_transfers"
          type="number"
          name="num_transfers"
          value={form.num_transfers}
          onChange={handleChange}
          placeholder="0"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="first_transfer_position" className="block mb-1 font-medium">First Transfer Position</label>
        <input
          id="first_transfer_position"
          type="number"
          name="first_transfer_position"
          value={form.first_transfer_position}
          onChange={handleChange}
          placeholder="0"
          className="border p-2 rounded w-full"
          min={1}
          max={form.num_cars - form.num_transfers + 1} // Assuming a maximum of 100 cars, adjust as needed
          required
        />
      </div>

      <div>
        <label htmlFor="intermission_lap" className="block mb-1 font-medium">Intermission Lap - leave as 0 if not applicable</label>
        <input
          id="intermission_lap"
          type="number"
          name="intermission_lap"
          value={form.intermission_lap}
          onChange={handleChange}
          placeholder="use 0 if not applicable"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 w-fit"
      >
        Create Race
      </button>
    </form>
  );
}