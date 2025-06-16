'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RacerClientType, RacerDriverClientType } from '@/models/Racer';
import { RaceClientType } from '@/models/Race';
import { postRacer } from '@/actions/postActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getRacersWithDriversByRaceId } from '@/actions/getActions';

// Props interface for the form
interface UpdateRacersCurrentPositionFormProps {
  race: RaceClientType;
  redirectUrl: string;
}

export default function UpdateRacersCurrentPositionForm({
  race,
  redirectUrl,
}: UpdateRacersCurrentPositionFormProps) {
  const router = useRouter();
  const [racerDrivers, setRacerDrivers] = useState<RacerDriverClientType[]>([]);
  const [positions, setPositions] = useState<Array<{ racerId: string | null; position: number }>>(
    Array.from({ length: race.num_cars }, (_, i) => ({ racerId: null, position: i + 1 }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch racers with drivers
  useEffect(() => {
    async function fetchData() {
      try {
        const racerDriversData = await getRacersWithDriversByRaceId(race._id);
        setRacerDrivers(racerDriversData);

        // Initialize positions based on current_position
        const initialPositions = Array.from({ length: race.num_cars }, (_, i) => ({
          racerId: null,
          position: i + 1,
        }));
        racerDriversData.forEach((rd) => {
          if (rd.racer.current_position && rd.racer.current_position <= race.num_cars) {
            initialPositions[rd.racer.current_position - 1].racerId = rd.racer._id;
          }
        });
        setPositions(initialPositions);
      } catch (error) {
        console.error('Error fetching racer drivers:', error);
      }
    }
    fetchData();
  }, [race._id, race.num_cars]);

  // Get all racers for a position (no filtering)
  const getAvailableRacers = () => {
    return [
      { racer: { _id: 'unknown', driver_id: '', current_position: null, race_id: '', starting_position: 0 }, driver: { _id: '', first_name: 'Unknown', last_name: '', car_number: '' } },
      ...racerDrivers,
    ];
  };

  // Handle racer selection
  const handleRacerChange = (position: number, racerId: string) => {
    setPositions((prev) => {
      const newPositions = [...prev];
      const newRacerId = racerId === 'unknown' ? null : racerId;

      // Clear the old position of the selected racer
      const oldPositionIndex = prev.findIndex(
        (p) => p.racerId === newRacerId && p.position !== position
      );
      if (oldPositionIndex !== -1) {
        newPositions[oldPositionIndex] = { ...newPositions[oldPositionIndex], racerId: null };
      }

      // Update the current position
      const currentIndex = position - 1;
      newPositions[currentIndex] = { ...newPositions[currentIndex], racerId: newRacerId };

      return newPositions;
    });
  };

  // Handle form submission
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const racerPromises = racerDrivers.map(async (rd) => {
        const newPosition = positions.find((p) => p.racerId === rd.racer._id)?.position || null;
        if (rd.racer.current_position !== newPosition) {
          const racerData: RacerClientType = {
            ...rd.racer,
            current_position: newPosition,
          };
          await postRacer(racerData);
          console.log('Updated racer:', racerData);
        }
      });
      await Promise.all(racerPromises);
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error updating racer positions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <h2 className="text-xl font-bold">Update Racer Positions for {race.name}</h2>

      {/* Dynamic Position Dropdowns */}
      {positions.map((pos) => {
        const position = pos.position;
        const selectedRacer = racerDrivers.find((rd) => rd.racer._id === pos.racerId);
        return (
          <div key={position} className="border p-4 rounded-md flex flex-col gap-2">
            <h3 className="text-md font-semibold">Position #{position}</h3>
            <div>
              <label className="text-sm font-medium">Select Racer</label>
              <Select
                value={pos.racerId || 'unknown'}
                onValueChange={(value) => handleRacerChange(position, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a racer" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRacers().map((rd) => (
                    <SelectItem key={rd.racer._id} value={rd.racer._id}>
                      {rd.racer._id !== 'unknown'
                        ? `${rd.driver.first_name} ${rd.driver.last_name} ${rd.driver.suffix || ''} - Car #${rd.driver.car_number}`
                        : 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedRacer && pos.racerId !== 'unknown' && (
              <p className="text-sm text-muted-foreground">
                Starting: #{selectedRacer.racer.starting_position}
              </p>
            )}
          </div>
        );
      })}

      <Button onClick={onSubmit} disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Update Positions'}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push(redirectUrl)}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
    </div>
  );
}