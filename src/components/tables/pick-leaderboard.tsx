import {
    Table,
    TableBody,
    TableCaption,
    TableCell,

    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { GameClientType } from "@/models/Game";

import { PickClientType } from "@/models/Pick";

export function convertIndexToLetter(index: number): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index % letters.length];
}

export default function TablePickLeaderboard({ game, picks }: { game: GameClientType; picks: PickClientType[] }) {
    if (!picks || picks.length === 0) {
        return <div className="text-center text-gray-500">No picks available.</div>;
    }

    // sort picks by rank in best to worst order
    picks.sort((a, b) => a.rank - b.rank);

    // Create an array of table headers
    const tableHeads = [
        { label: "Rank", className: "text-center" },
        { label: "Nickname", className: "text-left" },
        { label: "Owner", className: "text-center font-bold" },
        { label: "Score", className: "text-center" },
    ];
    // Dynamically add table headers based on game type
    if (game.type === 'hybrid') {
        tableHeads.push({ label: 'HardCh', className: "text-center text-secondary-foreground font-light" });
        tableHeads.push({ label: 'TopFin', className: "text-center text-secondary-foreground font-light" });
    }


    return (
        <Table>
            <TableCaption>leaderboard of player picks</TableCaption>
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
                {picks.map((pick: PickClientType, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="text-center">{pick.rank}</TableCell>
                        <TableCell className="text-left">{pick.nickname}</TableCell>
                        <TableCell className="text-center font-bold">{pick.name}</TableCell>
                        <TableCell className="text-center text-primary font-bold">{pick.score_total}</TableCell>
                        {game.type === 'hybrid' &&
                            <TableCell className="text-center text-muted-foreground">
                                {pick.score_hard_chargers}
                            </TableCell>
                        }
                        {game.type === 'hybrid' &&
                            <TableCell className="text-center text-muted-foreground">
                                {pick.score_top_finishers}
                            </TableCell>
                        }
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}