'use client';

import { useEffect, useState } from 'react';
import { GameClientType } from '@/models/Game';
import { getRacesByEventId } from '@/actions/getActions';
import { postGame } from '@/actions/postActions';
import { useRouter } from 'next/navigation';
import { RaceClientType } from '@/models/Race';

export default function CreateGameForm({eventId}: { eventId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<GameClientType>({
    _id: '',
    event_id: eventId,
    races: [],
    name: '',
    entry_fee: 0,
    house_cut: 0,
    purse_amount: -1,
    num_picks: -1,
    num_hard_chargers: -1,
    num_hard_chargers_predictions: -1, //number of hard chargers predictions
    num_top_finishers: -1,
    num_top_finishers_predictions: -1, //number of hard chargers predictions
    password: '', // password to access the game

  } as GameClientType);

    const [races, setRaces] = useState<RaceClientType[]>([]);
    const [selectedRaceIds, setSelectedRaceIds] = useState<string[]>([]);

    useEffect(() => {

    async function fetchRaces() {
      
      const fetched = await getRacesByEventId(eventId); // You must import this
      setRaces(fetched);
    }
    fetchRaces();

  }, [eventId]);

  const handleRaceSelect = (raceId: string) => {
    setSelectedRaceIds((prev) =>
      prev.includes(raceId)
        ? prev.filter((id) => id !== raceId) // remove if already selected
        : [...prev, raceId] // add if not selected
    );
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postGame(form);
      console.log("CreateGameForm submitted:", form);
      router.push('../');
        } catch (error) {
      console.error('Error creating game:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label htmlFor='name' className="block mb-1 font-medium">{`Name of Game`}</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Klootwyk Hard Charger Challenge"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Select Races to Include</label>
        <div className="flex flex-col gap-2">
          {races.map((race) => (
            <label key={race._id} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedRaceIds.includes(race._id as string)}
                onChange={() => handleRaceSelect(race._id as string)}
              />
              {race.type} {race.letter} ({race.laps} laps)
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 w-fit"
      >
        Create Game
      </button>
    </form>
  );
}