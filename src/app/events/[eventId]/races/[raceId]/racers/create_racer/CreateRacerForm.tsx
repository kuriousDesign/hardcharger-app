'use client';

import { useEffect, useState } from 'react';
import { postRacer } from '@/actions/postActions';
import { useRouter } from 'next/navigation';
import { RacerClientType } from '@/models/Racer';
import { getDriversNotInRace, getRace } from '@/actions/getActions';
import { DriverClientType } from '@/models/Driver';
import { RaceClientType } from '@/models/Race';
import { getDriverFullName } from '@/types/helpers';

export default function CreateRacerForm({raceId, eventId} : { raceId: string, eventId: string }) {
  const router = useRouter();

  const [form, setForm] = useState<RacerClientType>({
    _id: '',
    race_id: raceId,
    driver_id: '',
    starting_position: 0,
    current_position: 0,
  });

    const [drivers, setDrivers] = useState<DriverClientType[]>([]);
    const [race, setRace] = useState<RaceClientType>({} as RaceClientType);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // This should be replaced with a server action to fetch racers based on gameId
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getDriversNotInRace(raceId);
          setDrivers(data);
          const raceData = await getRace(raceId);
          setRace(raceData);
        } catch (error) {
          console.error('Error fetching racerDrivers:', error);
        }
      };
  
      fetchData();
    }, [raceId]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("submitting CreateRacerForm:", form);
      form.current_position = form.starting_position; // Set current position to starting position
      setIsSubmitting(true);
      await postRacer(form);
      
      // redirect to previous page
      router.push(`/events/${eventId}/races/${raceId}/racers`);

    } catch (error) {
      console.error('Error creating racer:', error);
    }
  };

  if(isSubmitting) {
    return <div className="text-center">Submitting...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <select
        name="driver_id"
        value={form.driver_id}
        onChange={(e) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
        className="border p-2 rounded"
        required
      >
        <option value="">Select a Driver</option>
        {drivers.map((driver:DriverClientType) => (
          <option key={driver._id} value={driver._id}>
            {`${getDriverFullName(driver)} - ${driver.car_number}`}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="starting_position"
        value={form.starting_position}
        onChange={handleChange}
        placeholder="Starting Position"
        className="border p-2 rounded"
        min={1}
        max={race.num_cars} // Assuming a maximum of 20 racers
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Racer
      </button>
    </form>
  );
}
