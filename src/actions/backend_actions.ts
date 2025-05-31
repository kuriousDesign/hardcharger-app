"use server"

import { Game, Entry, Driver, Race, RaceEvent, Racer} from "@/actions/models" 
const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://hard-charger-backend.onrender.com/api";

export async function fetchEvent(eventId: string) {
    //this will fetch data to use in the game selection form
    //console.log("Fetching race event from backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/events/${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching race events: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as RaceEvent;
    } catch (error) {
        console.error("Failed to fetch race events:", error);
        throw error;
    }
}

export async function fetchEvents() {
    //this will fetch data to use in the game selection form
    //console.log("Fetching race events from backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/events`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });
        if (!response.ok) {
            throw new Error(`Error fetching race events: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as RaceEvent[];
    } catch (error) {
        console.error("Failed to fetch race events:", error);
        throw error;
    }
}

export async function postRaceEvent(event: RaceEvent) {
    //console.log("Posting New Event to backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/create_event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) {
            throw new Error(`Error posting blah blah: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Event posted successfully:", data);
        //return data.data as RaceEvent;
    } catch (error) {
        console.error("Failed to post event:", error);
        throw error;
    }
}   

/**
 * Fetches data required for creating new game entries from the backend API.
 * 
 * @param game_id - The unique identifier of the game to fetch entry creation data for
 * @returns Promise that resolves to an array of Entry objects containing the creation data
 */

export async function fetchGames() {
    //this will fetch data to use in the game selection form
    //console.log("Fetching games from backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/games`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });
        if (!response.ok) {
            throw new Error(`Error fetching games: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as Game[];
    } catch (error) {
        console.error("Failed to fetch games:", error);
        throw error;
    }
}

export async function fetchGamesByEvent(eventId: string) {
    //console.log("Fetching games for event from backend API:", backendApiUrl);
    //console.log("Event ID:", eventId);
    try {
        const response = await fetch(`${backendApiUrl}/games/event/${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching games for event: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as Game[];
    } catch (error) {
        console.error("Failed to fetch games for event:", error);
        throw error;
    }
}

export async function fetchGame(game_id: string) {
    console.log("Fetching games from backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/games/${game_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching games: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as Game;
    } catch (error) {
        console.error("Failed to fetch games:", error);
        throw error;
    }
}

export async function postGame(game: Game) {
    console.log("Posting New Game to backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/create_game`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(game),
        });
        if (!response.ok) {
            throw new Error(`Error posting game: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Game posted successfully:", data);
    } catch (error) {
        console.error("Failed to post game:", error);
        throw error;
    }
}

export async function postEntry(entry: Entry) {
    console.log("Posting New Entry to backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/create_entry`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
        });
        if (!response.ok) {
            throw new Error(`Error posting entry: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Entry posted successfully:", data);
    } catch (error) {
        console.error("Failed to post entry:", error);
        throw error;
    }
}

export async function postRace(race: Race) {
    console.log("Posting New Race to backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/create_race`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(race),
        });
        if (!response.ok) {
            throw new Error(`Error posting race: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Race posted successfully:", data);
    } catch (error) {
        console.error("Failed to post race:", error);
        throw error;
    }
}

export async function postRacer(racer: Racer) {
    console.log("Posting New Racer to backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/create_racer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(racer),
        });
        if (!response.ok) {
            throw new Error(`Error posting racer: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Racer posted successfully:", data);
    } catch (error) {
        console.error("Failed to post racer:", error);
        throw error;
    }
}

export async function postDriver(driver: Driver) {
    console.log("Posting New Driver to backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/create_driver`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(driver),
        });
        if (!response.ok) {
            throw new Error(`Error posting driver: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Driver posted successfully:", data);
    } catch (error) {
        console.error("Failed to post driver:", error);
        throw error;
    }
}

export async function fetchEntriesByGame(game_id: string) {
    console.log("Fetching entries from backend API:", backendApiUrl);

    try {
        const response = await fetch(`${backendApiUrl}/entries/${game_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (!response.ok) {
            throw new Error(`Error fetching entries: ${response.statusText}`);
        }
        const data = await response.json();
        //const data = {'data': 'test'};
        return data.data as Entry[];
    } catch (error) {
        console.error("Failed to fetch entries:", error);
        throw error;
    }

}

// i want to fetch data from the backend api /entries which returns a list of entries
export async function fetchDrivers() {
    //console.log("Fetching drivers from backend API:", backendApiUrl);
    try {
        const response = await fetch(`${backendApiUrl}/drivers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
    
        if (!response.ok) {
            throw new Error(`Error fetching drivers: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data as Driver[];
    } catch (error) {
        console.error("Failed to fetch drivers:", error);
        throw error;
    }
}

export async function fetchRacesByEvent(eventId: string) {
    try {
        const response = await fetch(`${backendApiUrl}/races/event/${eventId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (!response.ok) {
            throw new Error(`Error fetching races by event: ${response.statusText}`);  
        }
        const data = await response.json();
        return  data.data as Race[];
    } catch (error) {
        console.error("Failed to fetch races by event:", error);
        throw error;
    }
}        

export async function fetchRaceEvents() {
    try {
        const response = await fetch(`${backendApiUrl}/events`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
            throw new Error(`Error fetching race events: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as RaceEvent;
    } catch (error) {
        console.error("Failed to fetch race:", error);
        throw error;
    }
}



export async function fetchRace(id:string) {
    try {
        const response = await fetch(`${backendApiUrl}/races/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
            throw new Error(`Error fetching race: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as Race;
    } catch (error) {
        console.error("Failed to fetch race:", error);
        throw error;
    }
}

export async function fetchRaces(event_id: string) {
    try {
        const response = await fetch(`${backendApiUrl}/races/${event_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
            throw new Error(`Error fetching races: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as Race[];
    } catch (error) {
        console.error("Failed to fetch races:", error);
        throw error;
    }
}

export async function fetchRacersByRaceId(race_id: string) {
    try {
        const response = await fetch(`${backendApiUrl}/racers/${race_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (!response.ok) {
            throw new Error(`Error fetching racers by race ID: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data as Racer[];
    } catch (error) {
        console.error("Failed to fetch racers by race ID:", error);
        throw error;
    }
}

export async function fetchRacersWithDriversByRaceId(race_id: string) {
    try {
        //console.log("Fetching racers with drivers by raceId", race_id);
        const response = await fetch(`${backendApiUrl}/racers-with-drivers/${race_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (!response.ok) {
            throw new Error(`Error fetching racers by race ID: ${response.statusText}`);
        }
        const data = await response.json();
        return data as {racers: Racer[], drivers: Driver[]};
    } catch (error) {
        console.error("Failed to fetch racers by race ID:", error);
        throw error;
    }
}