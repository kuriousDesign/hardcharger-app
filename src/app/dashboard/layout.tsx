import { Metadata } from "next"
import Link from "next/link"


import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { getLinks } from "@/lib/link-urls"

const title = "Pick your drivers. Win the pot."
const description =
  "Find a game and create a pick. Look at your current picks too."

export const metadata: Metadata = {
  title,
  description,
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <div>
      <PageHeader>
       
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button >
            <Link href={getLinks().getEventsUrl()}>Browse Events</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/picks">Active Picks</Link>
          </Button>
        </PageActions>
      </PageHeader>
      {children}
    </div>
  )
}