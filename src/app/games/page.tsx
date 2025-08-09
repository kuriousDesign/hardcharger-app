import { getGames } from "@/actions/getActions"
import { getLinks } from "@/lib/link-urls"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import GameDiv from "@/components/cards/game-div"
import { LinkButton } from "@/components/LinkButton"
import TabCard, { FilterOption } from "@/components/cards/tab-card"
import { getIsAdmin } from "@/actions/userActions"
const title = "Games"
const description = "Browse these games."

export const metadata = {
  title,
  description,
}

export default async function GamesPage() {
  const isAdminPromise = getIsAdmin();
  const gamesPromise = getGames();

  // Define filterable options for displaying games
  const filterableOptionsGames = [
    { key: "status", value: "open", tabLabel: 'Open' }, // "
    { key: "status", value: "in_play", tabLabel: 'InPlay' }, // "
    { key: "status", value: "created", tabLabel: 'Upcoming' },
    { key: "status", value: null, tabLabel: 'All' }, // "All" tab
  ] as FilterOption[];

  const [games, isAdmin] = await Promise.all([gamesPromise, isAdminPromise]);

  return (
    <div>
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          {isAdmin &&
            <LinkButton href={getLinks().getEventsUrl()} >
              Events
            </LinkButton>
          }
        
        </PageActions>
      </PageHeader>
      <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
        <div className="theme-container container flex flex-1 flex-col gap-4">
          <TabCard
            cardTitle="Games"
            cardDescription="Explore and play."
            items={games}
            filterableOptions={filterableOptionsGames}
            ComponentDiv={GameDiv}
          />
        </div>
      </div>
    </div>

  )
}