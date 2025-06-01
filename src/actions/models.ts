// Basic example of data interfaces - modify these based on your actual API response


//collection


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


