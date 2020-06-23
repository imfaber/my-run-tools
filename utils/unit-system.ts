import convert from 'convert-units';
import { UnitAbbreviation, UnitSystem, Measure } from './types';

export const lenghtUnits = Object.freeze([
    UnitAbbreviation.Meter,
    UnitAbbreviation.Kilometer,
    UnitAbbreviation.Mile,
    UnitAbbreviation.Yard
]);

export const lengthMetricUnits = Object.freeze([
    UnitAbbreviation.Meter,
    UnitAbbreviation.Kilometer
]);

export const lengthImperialUnits = Object.freeze([
    UnitAbbreviation.Mile,
    UnitAbbreviation.Yard
]);

export const paceUnits = Object.freeze([
    `${UnitAbbreviation.Minute}/${UnitAbbreviation.Kilometer}`,
    `${UnitAbbreviation.Minute}/${UnitAbbreviation.Mile}`
]);

export const units = Object.freeze({
    [Measure.Length]: lenghtUnits,
    [Measure.Pace]: paceUnits
});

export function getUnits(measure: Measure, system?: UnitSystem) {
    const list = convert()
        .list(measure)
        .filter((unit) => isValidUnit(measure, unit.abbr));

    return system ? list.filter((unit) => unit.system === system) : list;
}

export function getMetricUnits(measure: Measure) {
    return getUnits(measure, UnitSystem.Metric);
}

export function getImperialUnits(measure: Measure) {
    return getUnits(measure, UnitSystem.Imperial);
}

export function isValidUnit(measure: Measure, abbr: string): boolean {
    return (units as any)[measure].includes(abbr);
}

export default {
    getUnits,
    getMetricUnits,
    getImperialUnits,
    isValidUnit
};
