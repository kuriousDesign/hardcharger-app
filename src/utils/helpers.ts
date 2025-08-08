export function numberToOrdinal(num: number): string {
    const abs = Math.abs(num);
    const lastDigit = abs % 10;
    const lastTwoDigits = abs % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return `${num}th`;
    }

    switch (lastDigit) {
        case 1:
            return `${num}st`;
        case 2:
            return `${num}nd`;
        case 3:
            return `${num}rd`;
        default:
            return `${num}th`;
    }
}