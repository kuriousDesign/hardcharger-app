// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "../ui/separator"
import { PickClientType } from "@/models/Pick";
import { PlayerClientType } from "@/models/Player";

function getCardTitle(filterLabel: string | undefined): string {
  if (!filterLabel) return 'Picks';
  switch (filterLabel.toLowerCase()) {
    case 'active':
      return 'Active Picks';
    case 'past':
      return 'Past Picks';
    case 'upcoming':
      return 'Upcoming Picks';
    case 'all':
      return 'All Picks';
    default:
      return `${filterLabel.charAt(0).toUpperCase() + filterLabel.slice(1)} Picks`;
  }
}
export async function CardPicksGame({ picks, players, filterLabel, viewType }: { picks: PickClientType[], players: PlayerClientType[], filterLabel?: string, viewType?: 'full' | 'peek' }) {
  //const router = useRouter();
  if (!picks || picks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getCardTitle(filterLabel)}</CardTitle>
          <CardDescription>
            There are no picks available at the moment.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  let cardDescription = ''
  let cardTitle = '';


  if (filterLabel) {
    if (filterLabel.toLowerCase() === 'your') {

      //games = games.filter((game) => filterStatuses.includes(game.status));
      cardDescription = 'These are your picks for this game.';
      cardTitle = 'Your Picks';


    } else if (filterLabel.toLowerCase() === 'all') {
      cardDescription = 'All picks active or you have played.';
      cardTitle = 'All Picks';
    }
  }

  const PeekDiv = ({ pick }: { pick: PickClientType }) => {
    const player = players.find(player => player._id === pick.player_id);
    const playerName = player ? player.name : 'Unknown Player';
    return (
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-4">
          {/* <Avatar>
            <AvatarImage src={pick.driver?.image || ''} alt={pick.driver?.name || 'Driver Avatar'} />
            <AvatarFallback>{pick.driver?.name?.charAt(0) || 'D'}</AvatarFallback>
          </Avatar> */}
          <span className="font-medium">{`${playerName} | ${pick.nickname}`}</span>
        </div>

      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {cardTitle}
        </CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {viewType === 'peek' && picks.map((pick: PickClientType, index: number) => {
          return (
            <>
              <PeekDiv key={pick._id} pick={pick} />
              {index !== picks.length - 2 &&
                <Separator orientation="horizontal" className='bg-muted' />
              }
            </>
          )
        })}

      </CardContent>
    </Card>
  )
}
