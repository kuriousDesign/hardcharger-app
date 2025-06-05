import { Metadata } from "next"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

const title = "Games"
const description =
  "Search for a game and create a pick or look at past games you played."

export const metadata: Metadata = {
  title,
  description,
}

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <PageHeader>
       
        <PageHeaderHeading > 
          {title}
        </PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        {/* <PageActions>
          <Button asChild size="sm">
            <a href="#/dashboard/games">Active Games</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/theming">Past Games</Link>
          </Button>
        </PageActions> */}
      </PageHeader>
      {children}
    </div>
  )
}
