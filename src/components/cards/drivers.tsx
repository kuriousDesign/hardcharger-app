import { DriverClientType } from "@/models/Driver";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
//import { getDrivers } from "@/actions/driverActions";
import { LinkButton } from "../LinkButton";
import {
    Avatar,
    AvatarFallback,
   // AvatarImage,
} from "@/components/ui/avatar"
import { getLinks } from "@/lib/link-urls";

import { Separator } from "../ui/separator";
import { IoMdAddCircle } from "react-icons/io";
import { checkIsAdmin } from "@/utils/roles";

import { SquarePen } from "lucide-react";
import { getDriverFullName } from "@/types/helpers";
import { getDrivers } from "@/actions/getActions";
export default async function DriversCard() {
    const isAdmin = await checkIsAdmin();
    const unfilteredDrivers = await getDrivers();
    // filter drivers whose first name begins with Transfer
    const drivers = unfilteredDrivers.filter((driver: DriverClientType) => {
        return driver.first_name && driver.first_name.toLowerCase().indexOf('transfer') === -1;
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Drivers</CardTitle>
                <CardDescription>
                    Active drivers that you can add to your races
                </CardDescription>
                {isAdmin && <LinkButton href={getLinks().getCreateDriverUrl()} size="lg" className="w-fit text-primary-foreground">
                <IoMdAddCircle />
                    Driver
                </LinkButton>}

            </CardHeader>
            <CardContent className="grid gap-6">
                {drivers?.map((driver: DriverClientType, index:number) => (

                    <div key={driver._id}>
                        <Button
                            key={driver._id}
                            className="w-full flex items-center justify-between gap-y-2 hover:bg-muted transition-colors shadow-md p-7 rounded-md z-50"
                            // href={getLinks().getDriverUrl(driver._id || '')}
                            variant='link' >
                            <div className="flex items-center gap-4 ">
                                <Avatar className="border">
                                    {/* <AvatarImage src={"/avatars/01.png"} alt="Image" /> */}
                                    <AvatarFallback>{`${driver.first_name.charAt(0)}${driver.last_name.charAt(0)}`}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-0.5 justify-start ">
                                    <p className="text-sm leading-none font-medium text-left">
                                        {getDriverFullName(driver)}
                                    </p>
                                    <div className="flex h-5 justify-start items-center space-x-3 text-xs text-muted-foreground">
                                        <div className='text-primary'>{driver.car_number}</div>
                                        <Separator orientation="vertical" />
                                        <div>{`${driver.hometown}`}</div>
                                    </div>
                                </div>
                            </div>
                            {true &&
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

                        </Button>

                        {index !== drivers.length - 1 &&
                            <Separator orientation="horizontal" className='bg-muted' />
                        }
                    </div>
                ))}
            </CardContent>
        </Card>

    );
};