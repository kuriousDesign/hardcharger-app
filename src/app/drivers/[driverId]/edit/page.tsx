import DriverForm from '@/components/forms/driver-form';
import { getDriver } from '@/actions/getActions';
import { DriverClientType } from '@/models/Driver';


export default async function EditDriverPage({
    params,
  }: {
    params: Promise<{ driverId: string; }>
  }) {
  const { driverId } = await params;

  let driver: DriverClientType;
  try {
    driver = await getDriver(driverId);
  } catch {
    console.error('Error fetching driver:', driverId);
    return <div>Driver not found</div>;
  }

  return (
    <div className="p-8">
      <DriverForm initialData={driver} />
    </div>
  );
}