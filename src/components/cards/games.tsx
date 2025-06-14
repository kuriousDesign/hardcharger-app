import { IoMdAddCircle } from "react-icons/io";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { LinkButton } from "@/components/LinkButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { GameClientType } from "@/models/Game"
import { Separator } from "../ui/separator"
import { getLinks } from "@/lib/link-urls";

export async function CardsGames({ games, filterLabel, showCreateButton, eventId }: { games: GameClientType[], filterLabel?: string, showCreateButton?: boolean, eventId?: string }) {

  if (!games || games.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel || ''} Games</CardTitle>
          <CardDescription>
            <p className="pb-4">
              There are no games available at the moment.
            </p>
            {showCreateButton && eventId &&
              <LinkButton
                className="w-fit text-primary-foreground"
                href={getLinks().getCreateGameUrl(eventId)} >
                <IoMdAddCircle />
                Create Game
              </LinkButton>

            }

          </CardDescription>

        </CardHeader>
      </Card>
    )
  }

  let cardDescription = ''
  let cardTitle = 'Games';

  if (filterLabel) {
    let filterStatuses = [] as string[];
    if (filterLabel.toLowerCase() === 'available') {
      filterStatuses = ['open', 'regisration_over', 'active',];
      games = games.filter((game) => filterStatuses.includes(game.status));
      cardDescription = 'make picks on these games.';
      cardTitle = 'Available Games';
    } else if (filterLabel.toLowerCase() === 'past') {
      filterStatuses = ['just_finished', 'completed', 'cancelled'];
      games = games.filter((game) => filterStatuses.includes(game.status));
      cardDescription = 'Completed games that you can review.';
      cardTitle = 'Past Games';
    } else if (filterLabel.toLowerCase() === 'upcoming') {
      filterStatuses = ['created'];
      games = games.filter((game) => filterStatuses.includes(game.status));
      cardTitle = 'Upcoming Games';
      cardDescription = 'All games active or you have played.';
    } else if (filterLabel.toLowerCase() === 'all') {
      cardDescription = 'All games active or you have played.';
      cardTitle = 'All Games';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle> {cardTitle}</CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
        {showCreateButton && eventId &&
          <LinkButton
            className="w-fit "
            href={getLinks().getCreateGameUrl(eventId)} >
            <IoMdAddCircle />
            Create Game
          </LinkButton>
        }

      </CardHeader>

      <CardContent className="grid gap-6">
        {games.map((game: GameClientType) => (
          <div key={game._id}>

            <div
              key={game._id}
              className="w-full flex items-center justify-between gap-y-2 hover:bg-muted transition-colors shadow-md p-7 rounded-md z-50"
            >
              <LinkButton className="flex items-center gap-4 " href={getLinks().getGameUrl(game._id)} variant='ghost'  >
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
              </LinkButton>
              {game.status === 'open' &&
                <LinkButton
                  size="sm"

                  className='rounded-l-full rounded-r-full z-100'
                  href={getLinks().getCreatePickUrl(game._id as string)}
                >
                  <IoMdAddCircle />
                  Pick
                </LinkButton>
              }

            </div>

          </div>
        ))}
      </CardContent>
    </Card>
  )
}
