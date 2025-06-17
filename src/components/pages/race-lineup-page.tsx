'use client';

import { useState } from 'react';
import { DriverClientType } from '@/models/Driver';
import { RaceClientType } from '@/models/Race';
import { RacerClientType } from '@/models/Racer';
import CreateRacersRaceStartingLineupForm from '@/components/forms/create-racers-race-starting-lineup';
import DriverForm from '@/components/forms/driver-form';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Plus } from 'lucide-react';

interface RaceLineupPageProps {
  race: RaceClientType;
  drivers: DriverClientType[];
  existingRacers?: RacerClientType[];
  redirectUrl: string;
}

export default function RaceLineupPage({
  race,
  drivers: initialDrivers,
  existingRacers,
  redirectUrl,
}: RaceLineupPageProps) {
  const [drivers, setDrivers] = useState<DriverClientType[]>(initialDrivers);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDriverCreated = (newDriver: DriverClientType) => {
    setDrivers((prev) => [...prev, newDriver].sort((a, b) =>
      a.last_name.localeCompare(b.last_name, 'en', { sensitivity: 'base' })
    ));
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative min-h-screen p-4">
      <CreateRacersRaceStartingLineupForm
        race={race}
        drivers={drivers}
        existingRacers={existingRacers}
        redirectUrl={redirectUrl}
      />

      {/* Floating Button */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
            size="icon"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Driver</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <DriverForm onSuccess={handleDriverCreated} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}