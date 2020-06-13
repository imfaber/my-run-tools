import {
    stringToDuration,
    durationToString,
    formatDurationString,
    stringToMinutes,
    minsToDuration
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
