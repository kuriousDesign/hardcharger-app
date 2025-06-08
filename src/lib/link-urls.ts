// the point of this file is to provide helper functions for creating urls for links and navigation
//import { usePathname } from "next/navigation";

export function getLinks() {
    //const pathname = usePathname();

    const getHomeUrl = () => {
        return '/';
    };

    const getDashboardUrl = () => {
        return '/dashboard';
    };

    const getEventsUrl = () => {
        return '/events';
    };

    const getEventUrl = (eventId?: string) => {
        return `${getEventsUrl()}/${eventId || '_'}`;
    }

    const getDriversUrl = () => {
        return '/drivers';
    };

    const getDriverUrl = (driverId: string) => {
        return `${getDriversUrl()}/${driverId}`;
    };

    const getCreateDriverUrl = () => {
        return `${getDriversUrl()}/create`;
    };

    const getEditDriverUrl = (driverId: string) => {
        return `${getDriversUrl()}/${driverId}/edit`;
    };
    

    const getGamesUrl = () => {
        return '/games';
    };

    const getGameUrl = (gameId?: string) => {
        return `${getGamesUrl()}/${gameId || '_'}`;
    };

    const getCreateEventUrl = () => {
        return `/events/create`;
    }



    const getRacesUrl = (eventId: string) => {
        return `${getEventsUrl()}/${eventId}/races`;
    }

    const getRaceUrl = (eventId: string, raceId: string) => {
        return `${getRacesUrl(eventId)}/${raceId}`;
    }

    const getCreateRaceUrl = (eventId?: string) => {
        return `${getRacesUrl(eventId || '_')}/create`;
    }

    const getEditRaceUrl = (eventId: string, raceId: string) => {
        return `${getRacesUrl(eventId)}/${raceId}/edit`;
    }


    const getCreateRacerUrl = (raceId?: string) => {
        return `/admin/create_racer/${raceId || '_'}`;
    }

    const getCreateGameUrl = (eventId?: string) => {
        return `/admin/create_game/${eventId || '_'}`;
    }

    const getRacesByEventUrl = (eventId: string) => {
        return `/races/${eventId}`;
    }

    const getPicksUrl = (gameId?: string) => {
        return `${getGameUrl(gameId)}/picks`;
    }   


    return {
        getCreateEventUrl,
        getCreateRaceUrl,
        getCreateGameUrl,
        getHomeUrl,
        getEventsUrl,
        getEventUrl,
        getDriversUrl,
        getDriverUrl,
        getCreateDriverUrl,
        getEditDriverUrl,
        getGamesUrl,
        getDashboardUrl,
        getCreateRacerUrl,
        getRacesByEventUrl,
        getRaceUrl,
        getEditRaceUrl,
        getRacesUrl,
        getPicksUrl,
        //currentPath: pathname
    };
}