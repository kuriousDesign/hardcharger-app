import Link from "next/link"


import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/components/ui/button"


export type LayoutProps = {
    children: React.ReactNode,
    title: string,
    description?: string,
}


export default function DefaultLayout({
    children,
    title,
    description,
}: LayoutProps) {
    return (
        <div>
            <PageHeader>

                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    <Button asChild size="sm">
                        <Link href="/games">Browse games</Link>
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