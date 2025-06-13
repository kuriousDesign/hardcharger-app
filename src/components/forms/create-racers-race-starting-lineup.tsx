'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { RacerClientType } from '@/models/Racer';
import { DriverClientType } from '@/models/Driver';
import { postRacer} from '@/actions/postActions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { RaceClientType } from '@/models/Race';

// Props interface for the form
interface RaceLineupFormProps {
  race: RaceClientType;
  drivers: DriverClientType[];
  redirectUrl: string; // Redirect URL after submission
  existingRacers?: RacerClientType[];
}

// Form data type
interface RaceLineupFormData {
  racers: Array<{
    _id?: string; // Optional for edit mode
    driver_id: string;
    starting_position: number;
    current_position: number;
  }>;
}

// Function to get the next letter in the alphabet
function getNextLetter(letter: string): string {
  if (!letter || letter.length !== 1 || !/^[A-Za-z]$/.test(letter)) {
    return letter; // Return original if not a single letter
  }
  const isUpperCase = letter === letter.toUpperCase();
  const charCode = letter.toLowerCase().charCodeAt(0);
  if (charCode === 'z'.charCodeAt(0)) {
    return isUpperCase ? 'A' : 'a';
  }
  const nextCharCode = charCode + 1;
  const nextLetter = String.fromCharCode(nextCharCode);
  return isUpperCase ? nextLetter.toUpperCase() : nextLetter;
}

export default function CreateRacersRaceStartingLineupForm({ race, drivers, redirectUrl, existingRacers }: RaceLineupFormProps) {
  const router = useRouter();
  const numCars = race.num_cars;
  const raceId = race._id;
  const isEditMode = !!existingRacers && existingRacers.length > 0;

  // Initialize racers array for all positions (1 to numCars)
  const initialRacers = Array.from({ length: numCars }, (_, index) => {
    const position = index + 1;
    // Look for an existing racer at this starting position
    const existingRacer = existingRacers?.find(
      (racer) => racer.starting_position === position
    );
    if (existingRacer) {
      return {
        _id: existingRacer._id,
        driver_id: existingRacer.driver_id,
        starting_position: existingRacer.starting_position,
        current_position: existingRacer.current_position,
      };
    }
    // If no existing racer, create a default entry
    const racer = {
      driver_id: '',
      starting_position: position,
      current_position: position,
    };
    // Auto-fill driver_id for transfer positions if no existing racer
    if (drivers.length > 0 && position >= race.first_transfer_position && position < race.first_transfer_position + race.num_transfers) {
      console.log(`Looking for transfer driver for position ${position}`);
      const transferDriver = drivers.find(
        (d) => d.car_number === `T${position - race.first_transfer_position + 1}${getNextLetter(race.letter)}`
      );
      if (transferDriver) {
        console.log(`Auto-filling transfer driver for position ${position}:`, transferDriver.car_number);
      }
      racer.driver_id = transferDriver?._id || '';
    }
    return racer;
  });

  // Initialize form with React Hook Form
  const form = useForm<RaceLineupFormData>({
    defaultValues: {
      racers: initialRacers,
    },
  });

  // Handle form submission
  const onFormSubmit = async (data: RaceLineupFormData) => {
    try {
      const racerPromises = data.racers.map(async (racer, index) => {
        const racerData: RacerClientType = {
          ...racer,
          race_id: raceId as string,
          starting_position: index + 1, // Auto-order by position in array
          current_position: index + 1, // Sync current with starting for lineup
        };
        if (isEditMode && racer._id && racer._id !== '') {
          await postRacer(racerData);
          console.log('Updated racer:', racerData);
        } else if (racer.driver_id && racer.driver_id !== '') {
          await postRacer(racerData);
          console.log('Created racer:', racerData);
        } else {
          console.warn(`Skipping racer at position ${index + 1} due to missing driver_id`);
        }
      });
      await Promise.all(racerPromises); // Wait for all racers to be created/updated
      router.push(redirectUrl); // Redirect to provided URL
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} race lineup:`, error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-4 max-w-2xl">
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Edit Race Starting Lineup' : 'Set Race Starting Lineup'}
        </h2>

        {/* Dynamic Racer Forms */}
        {form.getValues('racers').map((racer, index) => (
          <div key={index} className="border p-4 rounded-md flex flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-md font-semibold">Starting</h1>
              <h1 className="text-md font-semibold mb-2">Position</h1>
              <h2 className="text-lg font-semibold">{racer.starting_position}</h2>
            </div>

            <FormField
              control={form.control}
              name={`racers.${index}.driver_id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Driver</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver._id} value={driver._id as string}>
                            {driver.first_name} {driver.last_name} {driver.suffix || ''} - Car #{driver.car_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? 'Submitting...' : isEditMode ? 'Update Race Lineup' : 'Create Race Lineup'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push(redirectUrl)}
        >
          Cancel
        </Button>
      </form>
    </Form>
  );
}