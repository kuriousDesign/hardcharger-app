import { getDriver } from "@/actions/getActions";
import { LinkButton } from "@/components/LinkButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLinks } from "@/lib/link-urls";
import { getIsAdmin } from "@/actions/userActions";
import { SquarePen } from "lucide-react";
import { getDriverFullName } from "@/types/helpers";

export default async function DriverPage({
  params,
}: {
  params: Promise<{ driverId: string; }>
}) {
  const { driverId } = await params;
  const isAdmin = await getIsAdmin();

  const driver = await getDriver(driverId);

  if (!driver) {
    return <div className="p-6">Driver not found</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{getDriverFullName(driver)}</CardTitle>
          <CardDescription>
            Active drivers that you can add to your races
          </CardDescription>
          {isAdmin &&
            <LinkButton
              size="sm"
              href={getLinks().getEditDriverUrl(driver._id || '')}
              variant='ghost'

              className='rounded-l-full rounded-r-full z-100'
            // onClick={(e) => {
            //     e.stopPropagation(); // Prevent Link click
            //     //router.push(`/drivers/${driver._id}/create_pick`)
            // }}
            >
              <SquarePen />

            </LinkButton>
          }

        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">
              {driver.first_name} {driver.last_name}
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Hometown: {driver.hometown || 'N/A'}
            </p>

          </div>
          <div className="flex flex-col items-start space-y-2">
            <p className="text-lg font-semibold">Car Number: {driver.car_number}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}