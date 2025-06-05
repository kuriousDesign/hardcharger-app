"use client"

import { ChevronDown } from "lucide-react"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { GameClientType } from "@/models/Game"



export function CardsGames({games, filterLabel}:{games: GameClientType[],filterLabel?: string}) {
  if (!games || games.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel || ''} Games</CardTitle>
          <CardDescription>
            There are no games available at the moment.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  let cardDescription = 'Invite your team members to collaborate.'

  if (filterLabel) {
    if (filterLabel.toLowerCase() === 'active') {
      const activeStatuses = ['open', 'regisration_over', 'active', 'just_finished', 'completed', 'cancelled'];
      games = games.filter((game) => activeStatuses.includes(game.status));
      cardDescription = 'Active games that you can join or view.';
    } else if (filterLabel.toLowerCase() === 'past') {
      games = games.filter((game) => game.status === 'completed')
      cardDescription = 'Completed games that you can review.';
    } else if (filterLabel.toLowerCase() === 'all') { 
      cardDescription = 'All games active or you have played.';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{filterLabel || ''} Games</CardTitle>
        <CardDescription>
          { cardDescription }
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {games.map((game:GameClientType) => (
          <div
            key={game._id}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Avatar className="border">
                <AvatarImage src={"/avatars/01.png"} alt="Image" />
                <AvatarFallback>{game.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm leading-none font-medium">
                  {game.name}
                </p>
                <p className="text-muted-foreground text-xs">${game.entry_fee} entry</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto shadow-none"
                >
                  {game.house_cut} <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandInput placeholder="Select role..." />
                  <CommandList>
                    <CommandEmpty>No games found.</CommandEmpty>
                    <CommandGroup>
                      {games.map((game:GameClientType) => (
                        <CommandItem key={game._id}>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{game.name}</p>
                            <p className="text-muted-foreground">
                              {game.num_picks.toString()} picks
                            </p>
                            <p className="text-muted-foreground">
                              ${game.entry_fee.toString()} entry
                            </p>
                            <p className="text-muted-foreground">
                              ${game.purse_amount.toString()} pot
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
