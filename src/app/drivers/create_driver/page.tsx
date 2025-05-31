// src/app/drivers/create_driver/page.tsx
import CreateDriverForm from './CreateDriverForm';

export default function CreateDriverPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Racer</h1>
      <CreateDriverForm />
    </div>
  );
}
