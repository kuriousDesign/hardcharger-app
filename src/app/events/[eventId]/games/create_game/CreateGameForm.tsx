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
    status: 'created', // or 'upcoming' based on your requirements
    entry_fee: 10,
    house_cut: 0,
    purse_amount: 0, //not used in the form
    num_picks: 0, // not used in the form
    num_hard_chargers: 3,
    num_hard_chargers_predictions: 3, //number of hard chargers predictions
    hard_charger_prediction_penalty: 0.25, // penalty for not wrong prediction, point per car
    hard_charger_prediction_penalty_max: 3, // 

    num_top_finishers: 3,
    num_top_finishers_predictions: 3, //number of hard chargers predictions
    top_finisher_prediction_penalty: 1.0, // penalty for not wrong prediction, point per car
    top_finisher_prediction_penalty_max: 100, // penalty for not wrong prediction, point per car
    is_private: false, // whether the game is private or not
    password: '', // password to access the game

  });

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
    const gameFormWithRaces = {
      ...form,
      races: selectedRaceIds, // ← populate races field with selected IDs
    };

    console.log("CreateGameForm submitted:", gameFormWithRaces);
    await postGame(gameFormWithRaces);
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
        <label className="block mb-1 font-medium">Select Races to Include (at least one required)</label>
        <div className="flex flex-col gap-2">
          {races.map((race) => (
        <label key={race._id} className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedRaceIds.includes(race._id as string)}
            onChange={() => handleRaceSelect(race._id as string)}
            required={selectedRaceIds.length === 0}
          />
          {race.type} {race.letter} ({race.laps} laps)
        </label>
          ))}
        </div>
        {selectedRaceIds.length === 0 && (
          <p className="text-red-500 text-sm mt-1">Please select at least one race</p>
        )}
      </div>

      <div>
        <label htmlFor="entry_fee" className="block mb-1 font-medium">Entry Fee</label>
        <input
          id="entry_fee"
          type="number"
          name="entry_fee"
          value={form.entry_fee}
          onChange={handleChange}
          placeholder="e.g., 10.00"
          className="border p-2 rounded w-full"
          required
          min={0}
          max={1000}
        />
      </div>
      <div>
        <label htmlFor="house_cut" className="block mb-1 font-medium">House Cut (0-20%)</label>
        <input
          id="house_cut"
          type="number"
          name="house_cut"
          value={form.house_cut}      
          onChange={handleChange}
          placeholder="e.g., 10"
          className="border p-2 rounded w-full"
          required
          min={0}
          max={20}
        />
      </div>
      <div>
        <label htmlFor="num_hard_chargers" className="block mb-1 font-medium">Number of Hard Chargers</label>
        <input
          id="num_hard_chargers"
          type="number"
          name="num_hard_chargers"
          value={form.num_hard_chargers}
          onChange={handleChange}
          placeholder="e.g., 3"
          className="border p-2 rounded w-full"
          required
          min={0}
          max={24} // Assuming a maximum of 100 hard chargers, adjust as needed
        />
      </div>
      <div>
        <label htmlFor="num_hard_chargers_predictions" className="block mb-1 font-medium">Number of Hard Chargers Predictions</label>
        <input
          id="num_hard_chargers_predictions"
          type="number"
          name="num_hard_chargers_predictions"
          value={form.num_hard_chargers_predictions}
          onChange={handleChange}
          placeholder="e.g., 3"     
          className="border p-2 rounded w-full" 
          required
          min={0}
          max={form.num_hard_chargers} // Assuming a maximum of 100 hard chargers, adjust as needed
        />
      </div>
      <div>
        <label htmlFor="hard_charger_prediction_penalty" className="block mb-1 font-medium">Hard Charger Prediction Penalty (points per car)</label>
        <input
          id="hard_charger_prediction_penalty"
          type="number"
          name="hard_charger_prediction_penalty"
          value={form.hard_charger_prediction_penalty}
          onChange={handleChange}
          placeholder="e.g., 0.5"
          className="border p-2 rounded w-full"
          required
          min="0.0"
          max="1.0"
          step="0.05"
        />
      </div>
      <div>
        <label htmlFor="hard_charger_prediction_penalty_max" className="block mb-1 font-medium">Hard Charger Prediction Penalty Max (points per car)</label>
        <input
          id="hard_charger_prediction_penalty_max"
          type="number"
          name="hard_charger_prediction_penalty_max"
          value={form.hard_charger_prediction_penalty_max}
          onChange={handleChange}
          placeholder="e.g., 10"
          className="border p-2 rounded w-full"
          required
          min={0}
          max={100} // Assuming a maximum of 100 points, adjust as needed
        />
      </div>
      <div>
        <label htmlFor="num_top_finishers" className="block mb-1 font-medium">Number of Top Finishers</label>
        <input
          id="num_top_finishers"        
          type="number"
          name="num_top_finishers"
          value={form.num_top_finishers}
          onChange={handleChange}
          placeholder="e.g., 3"
          className="border p-2 rounded w-full"
          required
          min={0}
          max={24} // Assuming a maximum of 100 top finishers, adjust as needed
        />
      </div>
      <div>   
        <label htmlFor="num_top_finishers_predictions" className="block mb-1 font-medium">Number of Top Finishers Predictions</label>
        <input
          id="num_top_finishers_predictions"
          type="number"
          name="num_top_finishers_predictions"
          value={form.num_top_finishers_predictions}
          onChange={handleChange}
          placeholder="e.g., 3"
          className="border p-2 rounded w-full"
          required
          min={0}
          max={form.num_top_finishers} // Assuming a maximum of 100 top finishers, adjust as needed
        />
      </div>
      <div>
        <label htmlFor="top_finisher_prediction_penalty" className="block mb-1 font-medium">Top Finisher Prediction Penalty (points per car)</label>
        <input
          id="top_finisher_prediction_penalty"
          type="number"
          name="top_finisher_prediction_penalty"
          value={form.top_finisher_prediction_penalty}
          onChange={handleChange}
          placeholder="e.g., 2"
          className="border p-2 rounded w-full"
          required
          min="0.0"
          max="1.0"
          step="0.05"
        />
      </div>
      <div>
        <label htmlFor="top_finisher_prediction_penalty_max" className="block mb-1 font-medium">Top Finisher Prediction Penalty Max (points per car)</label>
        <input
          id="top_finisher_prediction_penalty_max"
          type="number"
          name="top_finisher_prediction_penalty_max"
          value={form.top_finisher_prediction_penalty_max}
          onChange={handleChange}
          placeholder="e.g., 10"
          className="border p-2 rounded w-full"
          required
          min={0}
          max={100} // Assuming a maximum of 100 points, adjust as needed
        />
      </div>
      <div>
        <label htmlFor="is_private" className="block mb-1 font-medium">Is this game private?</label>
        <select
          id="is_private"
          name="is_private"
          value={form.is_private ? 'true' : 'false'}
          onChange={(e) => setForm({ ...form, is_private: e.target.value === 'true' })}
          className="border p-2 rounded w-full"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
      {form.is_private && (
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="text"
            name="password"
            value={form.password ? form.password : ''}
            onChange={handleChange}
            placeholder="Enter password for private game"
            className="border p-2 rounded w-full"
          />
        </div>

      )}  
      <button
        type="submit"
        className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 w-fit"
      >
        Create Game
      </button>
    </form>
  );
}