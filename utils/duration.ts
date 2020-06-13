import parseDuration from 'parse-duration';
import { Duration } from './types';

export function stringToDuration(str: string): Duration | undefined {
    let durationStr = str;

    if (!isValidDurationFormat(str)) {
        const parsedDurationStr = parseDuration(str);

        if (!parsedDurationStr) {
            return;
        }

        const date = new Date(parsedDurationStr);
        durationStr = date.toISOString().slice(11, 19);
    }

    const timeArr = durationStr.split(':').map((x: string) => parseInt(x));

    if (timeArr.length === 2) {
        timeArr.unshift(0);
    }

    const [hours, minutes, seconds] = timeArr;
    return { hours, minutes, seconds };
}

export function stringToMinutes(str: string): number | undefined | null {
    let durationStr = str;

    if (isValidDurationFormat(str)) {
        const duration = stringToDuration(str);

        if (!duration) {
            return;
        }

        durationStr = `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`;
    }

    return parseDuration(durationStr, 'minute');
}

export function formatDurationString(str: string): string | undefined {
    const duration = stringToDuration(str);

    if (!duration) {
        return;
    }

    return durationToString(duration);
}

export function durationToString({
    hours,
    minutes,
    seconds
}: Duration): string {
    const h = padDurationPart(Math.round(hours));
    const m = padDurationPart(Math.round(minutes));
    const s = padDurationPart(Math.round(seconds));

    return `${h}:${m}:${s}`;
}

export function padDurationPart(n: number): string {
    return `0${n}`.slice(-2);
}

export function isValidDurationFormat(time: string): boolean {
    return /^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/.test(time);
}

export function minsToDuration(mins: number): string | undefined {
    if (!mins || isNaN(mins) || mins <= 0) return;

    const parsed = mins
        .toFixed(2)
        .toString()
        .split('.')
        .map((x) => parseInt(x));

    const hours = Math.floor(parsed[0] / 60);
    const minutes = parsed[0] - hours * 60;
    const seconds = Math.round((parsed[1] * 60) / 100);

    return `${padDurationPart(hours)}:${padDurationPart(
        minutes
    )}:${padDurationPart(seconds)}`;
}

// export function timeToDate(time: Duration | string) {
//     const { hours, minutes, seconds } =
//         typeof time === 'string' ? stringToDuration(time) : time;

//     if (
//         isNaN(hours) ||
//         hours < 0 ||
//         hours > 23 ||
//         isNaN(minutes) ||
//         minutes < 0 ||
//         minutes > 59 ||
//         isNaN(seconds) ||
//         seconds < 0 ||
//         seconds > 59
//     ) {
//         return;
//     }

//     const d = new Date();
//     d.setHours(hours);
//     d.setMinutes(minutes);
//     d.setSeconds(seconds);
//     return d;
// }

// export function dateToMinutes(date: Date): Number | undefined {
//     if (!(date instanceof Date)) {
//         return;
//     }

//     const h = date.getHours();
//     const m = date.getMinutes();
//     const s = date.getSeconds();

//     return h * 60 + m + s / 60;
// }
