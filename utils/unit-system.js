import convert from 'convert-units';

export const UNIT_SYSTEM_METRIC = 'metric';
export const UNIT_SYSTEM_IMPERIAL = 'imperial';

export const UNIT_SYSTEM_METER_ABBR = 'm';
export const UNIT_SYSTEM_KILOMETER_ABBR = 'km';
export const UNIT_SYSTEM_YARD_ABBR = 'yd';
export const UNIT_SYSTEM_MILE_ABBR = 'mi';
export const UNIT_SYSTEM_MINUTE_ABBR = 'min';

export const UNIT_SYSTEM_MEASURE_LENGTH = 'length';
export const UNIT_SYSTEM_MEASURE_PACE = 'pace';

export const UNIT_SYSTEM_MEASURES = Object.freeze([
    UNIT_SYSTEM_MEASURE_LENGTH,
    UNIT_SYSTEM_MEASURE_PACE
]);

export const UNIT_SYSTEM_LENGTH_UNITS = Object.freeze([
    UNIT_SYSTEM_METER_ABBR,
    UNIT_SYSTEM_KILOMETER_ABBR,
    UNIT_SYSTEM_MILE_ABBR,
    UNIT_SYSTEM_YARD_ABBR
]);

export const UNIT_SYSTEM_PACE_UNITS = Object.freeze([
    `${UNIT_SYSTEM_MINUTE_ABBR}/${UNIT_SYSTEM_KILOMETER_ABBR}`,
    `${UNIT_SYSTEM_MINUTE_ABBR}/${UNIT_SYSTEM_MILE_ABBR}`
]);

export const UNIT_SYSTEM_ALL_UNITS = Object.freeze({
    [UNIT_SYSTEM_MEASURE_LENGTH]: UNIT_SYSTEM_LENGTH_UNITS,
    [UNIT_SYSTEM_MEASURE_PACE]: UNIT_SYSTEM_PACE_UNITS
});

export const UNIT_SYSTEM_LENGTH_METRIC_UNITS = Object.freeze([
    UNIT_SYSTEM_METER_ABBR,
    UNIT_SYSTEM_KILOMETER_ABBR
]);

export const UNIT_SYSTEM_LENGTH_IMPERIAL_UNITS = Object.freeze([
    UNIT_SYSTEM_MILE_ABBR,
    UNIT_SYSTEM_YARD_ABBR
]);

export function getUnits(measure, system = null) {
    const list = convert()
        .list(measure)
        .filter((l) => isValidUnit(measure, l.abbr));

    return system ? list.filter((l) => l.system === system) : list;
}

export function getMetricUnits(measure) {
    return getUnits(measure, UNIT_SYSTEM_METRIC);
}

export function getImperialUnits(measure) {
    return getUnits(measure, UNIT_SYSTEM_IMPERIAL);
}

export function isValidUnit(measure, abbr) {
    return UNIT_SYSTEM_ALL_UNITS[measure].includes(abbr);
}

export default {
    getUnits,
    getMetricUnits,
    getImperialUnits,
    isValidUnit
};
