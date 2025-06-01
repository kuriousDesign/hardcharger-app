// Basic example of data interfaces - modify these based on your actual API response


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

//collection
export interface Pick {
    _id: string;
    game_id: string;
    user_id: string;
    pick_nickname: string;
    //phone_number: number;
    paid_status: string; // "pending", "paid", "unpaid", "partial"
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

// export interface RaceResult{
//     main_letter: string;
//     starting_position: number;
//     current_position: number;
// }


