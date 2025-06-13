import {
    Table,
    TableBody,
    TableCaption,
    TableCell,

    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export interface HardChargerLeaderboardEntry {
    rank: number; // Rank of the driver in the leaderboard
    _driver_id: string;
    driver_name: string; // Name of the driver
    total_cars_passed: number; // Total number of cars passed
    cars_passed_by_race: number[]; // Array
}

const defaultEntries = [
    {
   
        _driver_id: "1",
        driver_name: "John Doe",
        total_cars_passed: 15,
        cars_passed_by_race: [5, 3, 7],
    },
    {
   
        _driver_id: "2",
        driver_name: "Jane Smith",
        total_cars_passed: 20,
        cars_passed_by_race: [6, 8, 6],
    },
    {
    
        _driver_id: "3",
        driver_name: "Jake Gardner",
        total_cars_passed: 20,
        cars_passed_by_race: [7, 7, 6],
    },
    {
        _driver_id: "4",
        driver_name: "Alice Johnson",
        total_cars_passed: 10,
        cars_passed_by_race: [2, 4, 4],
    },
    {
        _driver_id: "5",
        driver_name: "Bob Brown",
        total_cars_passed: 18,
        cars_passed_by_race: [7, 5, 6],
    }
] as HardChargerLeaderboardEntry[];

function convertIndexToLetter(index: number): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index % letters.length];
}

export function TableHardChargerLeaderboard({ entries = defaultEntries }: { entries?: HardChargerLeaderboardEntry[] }) {
    if (!entries || entries.length === 0) {
        return <div className="text-center text-gray-500">No entries available.</div>;
    }

    // sort entries by total_cars_passed in descending order
    entries.sort((a, b) => b.total_cars_passed - a.total_cars_passed);
    // Assign ranks based on the sorted order
    entries.map((entry, index) => {
        let rank = 0;
        if (index === 0) {
            rank = 1; // First entry gets rank 1
        } else {
            // if number of cars passed is the same as previous entry, assign the same rank
            if (entry.total_cars_passed === entries[index - 1].total_cars_passed) {
                rank = entries[index - 1].rank; // Same rank as previous entry
            }
            else {
                rank = index + 1; // Otherwise, assign the next rank
            }
        }
        //ranks.push(rank);
        entry.rank = rank; // Assign the rank to the entry
    });

    // Create an array of table headers
    const tableHeads = [
        { label: "Rank", className: "text-center" },
        { label: "Driver", className: "text-left" },
        { label: "Total", className: "text-center font-bold" },
    ];
    // Dynamically add table headers based on the array of cars passed
    entries[0].cars_passed_by_race.forEach((_, index: number) => {
        tableHeads.push({ label: `${convertIndexToLetter(index)}`, className: "text-center text-secondary-foreground font-light" });
    });

    return (
        <Table>
            <TableCaption>leaderboard of hard chargers</TableCaption>
            <TableHeader>
                <TableRow>
                    {tableHeads.map((head, index) => (
                        <TableHead key={index} className={head.className}>
                            {head.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {entries.map((entry: HardChargerLeaderboardEntry, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="text-center">{entry.rank}</TableCell>
                        <TableCell className="text-left">{entry.driver_name}</TableCell>
                        <TableCell className="text-center text-primary font-bold">{entry.total_cars_passed}</TableCell>
                        {entry.cars_passed_by_race.map((carsPassed, raceIndex) => (
                            <TableCell key={raceIndex} className="text-center text-muted-foreground">
                                {carsPassed}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}