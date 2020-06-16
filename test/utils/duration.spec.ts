import {
    stringToDuration,
    durationToString,
    formatDurationString,
    stringToMinutes,
    minsToDuration,
    isValidDurationString
} from '~/utils/duration.ts';

describe('Duration utils', () => {
    test('stringToDuration() returns the correct duration object', () => {
        expect(stringToDuration('5h 5m')).toEqual({
            hours: 5,
            minutes: 5,
            seconds: 0
        });

        expect(stringToDuration('01:00:05')).toEqual({
            hours: 1,
            minutes: 0,
            seconds: 5
        });

        expect(stringToDuration('1:1:05')).toEqual(undefined);

        expect(stringToDuration('')).toEqual(undefined);
    });

    test('formatDurationString() returns the formatted duration', () => {
        expect(formatDurationString('5h 5m')).toEqual('05:05:00');
        expect(formatDurationString('05:05:00')).toEqual('05:05:00');
    });

    test('stringToMinutes() converts a duration string into minuts', () => {
        expect(stringToMinutes('5m')).toEqual(5);
        expect(stringToMinutes('01:00:00')).toEqual(60);
    });

    test('minsToDuration() converts minutes in a duration string', () => {
        expect(minsToDuration(65)).toEqual('01:05:00');
    });

    test('isValidDurationString() should determine whether the string is a valid duration string', () => {
        expect(isValidDurationString('90m')).toBeTruthy();
        expect(isValidDurationString('50m 30s')).toBeTruthy();
        expect(isValidDurationString('00:50:10')).toBeTruthy();
        expect(isValidDurationString('00:50:10')).toBeTruthy();
        expect(isValidDurationString('50')).toBeFalsy();
        expect(isValidDurationString('500:05:06')).toBeFalsy();
        expect(isValidDurationString('70:05:06')).toBeFalsy();
    });

    test('durationToString() returns the formatted duration', () => {
        expect(
            durationToString({
                hours: 5,
                minutes: 5,
                seconds: 5
            })
        ).toEqual('05:05:05');
    });
});
