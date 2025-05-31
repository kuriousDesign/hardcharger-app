// Basic example of data interfaces - modify these based on your actual API response

export interface RaceEvent {
    _id: string;
    name: string;
    date: string;
    location: string;
}

//collection
export interface Game {
    _id: string;
    name: string;
    event_id: string;
    entry_fee: number;
    num_entries: number;
    num_hard_chargers: number;
    num_top_finishers: number;
    races: number[]; //race ids
}

export interface Entry {
    event: RaceEvent;
    game: Game;
}

//collection
export interface Entry {
    _id: string;
    game_id: string;
    player_name: string;
    entry_nickname: string;
    phone_number: number;
    paid_status: boolean;
    payment_type: string;
    top_finishers: TopFinisher[];
    hard_chargers: HardCharger[];
}

export interface TopFinisher {
    racer_id: string
    position_guess: number;
}

export interface HardCharger {
    racer_id: string;
    gain_guess: number;
}

export interface Driver {
    _id: string;
    last_name: string;
    first_name: string;
    suffix: string;
    car_number: string;
}

// export interface RaceResult{
//     main_letter: string;
//     starting_position: number;
//     current_position: number;
// }

export interface Racer {
    _id: string
    race_id: string;
    driver_id: string;
    starting_position: number;
    current_position: number;
}

export interface Race {
    _id: string;
    event_id: string;
    status: string; // "lineup", "lineup_with_transfers", "in_progress", "finished"
    type: string;
    letter: string;
    num_cars: number;
    laps: number;
    num_transfers: number;
    first_transfer_position: number;
    intermission_lap: number;
}