'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { DriverClientType } from '@/models/Driver';
import { postDriver, updateDriver } from '@/actions/postActions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getLinks } from '@/lib/link-urls';
import { useState } from 'react';
import { formatHometown, parseHometown } from '@/types/helpers';
import { Hometown } from '@/types/globals';

// List of US states, Canadian provinces, and Australian states/territories
const regions = [
  // US States
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  // Canadian Provinces and Territories
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'YT', label: 'Yukon' },
  // Australian States and Territories
  { value: 'NSW', label: 'New South Wales' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'WA-AUS', label: 'Western Australia' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT-AU', label: 'Northern Territory' },
];

interface DriverFormProps {
  initialData?: DriverClientType; // Optional initial data for edit mode
}




export default function DriverForm({ initialData }: DriverFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData?._id; // Determine mode based on _id presence

  // Split hometown for edit mode if it exists
  //const initialCity = initialData?.hometown ? initialData.hometown.split(', ')[0] : '';
  //const initialRegion = initialData?.hometown ? initialData.hometown.split(', ')[1] : '';

  const {city, region }= initialData ? parseHometown(initialData?.hometown || '') as Hometown : { city: '', region: '' };
  const [hometown, setHometown] = useState({
    city,
    region,
  });



  // Initialize form with React Hook Form, handles creation vs. editing
  const form = useForm<DriverClientType>({
    defaultValues: initialData
      ? {
          first_name: initialData.first_name,
          last_name: initialData.last_name,
          suffix: initialData.suffix || '',
          car_number: initialData.car_number,
          hometown: initialData.hometown || '',
        }
      : {
          first_name: '',
          last_name: '',
          suffix: '',
          car_number: '',
          hometown: '',
        },
  });

  // Handle form submission
  const onFormSubmit = async (data: DriverClientType) => {
    try {
      // Concatenate city and region into hometown
      const driverData = {
        ...data,
        hometown: formatHometown(hometown),
      };

      if (isEditMode) {
        // Edit mode: call updateDriver
        if (!initialData?._id) throw new Error('Driver ID is missing');
        await updateDriver(initialData._id, driverData);
        console.log('Updated driver:', driverData);
      } else {
        // Create mode: call postDriver
        await postDriver(driverData);
        console.log('Created driver:', driverData);
      }
      router.push(getLinks().getDriversUrl()); // Redirect to drivers list
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} driver:`, error);
      // Optionally show error to user (e.g., toast notification)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-4 max-w-md">
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Edit Driver' : 'Create Driver'}
        </h2>

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="First Name"
                  className="w-full"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Last Name"
                  className="w-full"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suffix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suffix (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Suffix, e.g. Jr. or Sr."
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="car_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Car Number, e.g. 21K"
                  className="w-full"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Hometown City</FormLabel>
          <FormControl>
            <Input
              value={hometown.city}
              onChange={(e) => setHometown({ ...hometown, city: e.target.value })}
              placeholder="City, e.g. Coppock"
              className="w-full"
              required
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>State/Province/Territory</FormLabel>
          <FormControl>
            <Select
              value={hometown.region}
              onValueChange={(value) => setHometown({ ...hometown, region: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? 'Submitting...' : isEditMode ? 'Update Driver' : 'Create Driver'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push(getLinks().getDriversUrl())}
        >
          Cancel
        </Button>
      </form>
    </Form>
  );
}