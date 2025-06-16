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