'use client';

import { useState } from 'react';
import { DriverDoc } from '@/models/Driver';
import { postDriver } from '@/actions/postActions';
import { useRouter } from 'next/navigation';

export default function CreateDriverForm() {
  const router = useRouter();
  const [form, setForm] = useState<DriverDoc>({
    _id: '',
    first_name: '',
    last_name: '',
    suffix: '',
    car_number: '',
  } as DriverDoc);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postDriver(form);
      console.log("CreateDriverForm submitted:", form);
      router.push('../');
        } catch (error) {
      console.error('Error creating driver:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
        placeholder="First Name"
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        name="suffix"
        value={form.suffix || ''}
        onChange={handleChange}
        placeholder="Suffix (optional), e.g. Jr. or Sr."
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="car_number"
        value={form.car_number}
        onChange={handleChange}
        placeholder="Car Number, e.g. 21K"
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Driver
      </button>
    </form>
  );
}
