export const dynamic = 'force-dynamic';
import CardEvents from '@/components/cards/events';
import { getLinks } from '@/lib/link-urls';
import { LinkButton } from '@/components/LinkButton';


export default async function EventsPage() {
    return (
        <div className='flex flex-col gap-4 w-full h-full p-4'>
            <CardEvents />
            <LinkButton
                href={getLinks().getDashboardUrl()}
                isNavigation
                variant='secondary'
            >
                Dashboard
            </LinkButton>
        </div>
    );
}