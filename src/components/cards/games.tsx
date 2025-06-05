"use client"

import { IoMdAddCircle } from "react-icons/io";
import Link from "next/link"
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

import { GameClientType } from "@/models/Game"
import { Separator } from "../ui/separator"
import { useRouter } from "next/navigation"

export function CardsGames({ games, filterLabel }: { games: GameClientType[], filterLabel?: string }) {
  const router = useRouter();
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
    let filterStatuses = [] as string[];
    if (filterLabel.toLowerCase() === 'available') {
      filterStatuses = ['open', 'regisration_over', 'active',];
      games = games.filter((game) => filterStatuses.includes(game.status));
      cardDescription = 'Active games that you can join or view.';
    } else if (filterLabel.toLowerCase() === 'past') {
      filterStatuses = ['just_finished', 'completed', 'cancelled'];
      games = games.filter((game) => filterStatuses.includes(game.status));
      cardDescription = 'Completed games that you can review.';
    } else if (filterLabel.toLowerCase() === 'upcoming') {
      filterStatuses = ['created'];
      games = games.filter((game) => filterStatuses.includes(game.status));
      cardDescription = 'All games active or you have played.';
    } else if (filterLabel.toLowerCase() === 'all') {
      cardDescription = 'All games active or you have played.';
    }
  }



  return (
    <Card>
      <CardHeader>
        <CardTitle> {filterLabel ? filterLabel.charAt(0).toUpperCase() + filterLabel.slice(1) : ''} Games</CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {games.map((game: GameClientType, index) => (
          <>
            <Link
              href={`/dashboard/${game._id}`}
              key={game._id}
              className="flex items-center justify-between gap-y-2 hover:bg-muted transition-colors"
             
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
                  <div className="flex h-5 justify-start items-center space-x-3 text-xs text-muted-foreground">
                    <div className='text-primary'>${game.entry_fee} entry</div>
                    <Separator orientation="vertical" />
                    <div>{`$${game.purse_amount.toString()} pot`}</div>
                  </div>
                </div>
              </div>
              {game.status === 'open' &&
                <Button
                  size="sm"
                  className='rounded-l-full rounded-r-full'

                  onClick={() => {
                    //go to create pick page
                    router.push(`/dashboard/${game._id}/create_pick`)

                  }}
                >
                  <IoMdAddCircle />
                  Pick
                </Button>
              }

            </Link>
            {index !== games.length - 1 &&
              <Separator orientation="horizontal" className='bg-muted' />
              }
          </>
        ))}
      </CardContent>
    </Card>
  )
}
