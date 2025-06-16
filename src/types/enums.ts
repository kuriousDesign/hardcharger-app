// create an enum of GameStates 
export enum GameStates {
    OPEN = 'open',
    IN_PLAY = 'in_play',
    UPCOMING = 'created',
    FINISHED = 'finished'
}

export function gameStatesToString(state: GameStates): string {
    switch (state) {
        case GameStates.OPEN:
            return 'Open';
        case GameStates.IN_PLAY:
            return 'In Play';
        case GameStates.UPCOMING:
            return 'Upcoming';
        case GameStates.FINISHED:
            return 'Finished';
        default:
            return 'Unknown State';
    }
}

export enum RaceStates {
    LINEUP = 'lineup',
    RACING = 'racing',
    FINISHED = 'finished'
}

export function raceStatesToString(state: RaceStates): string {
    switch (state) {
        case RaceStates.LINEUP:
            return 'Lineup';
        case RaceStates.RACING:
            return 'Racing';                        
        case RaceStates.FINISHED:
            return 'Finished';
        default:
            return 'Unknown State';
    }
}