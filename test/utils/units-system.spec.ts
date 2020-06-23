import { getUnits } from '~/utils/unit-system.ts';
import { Measure, UnitSystem } from '~/utils/types.ts';

describe('Unit System', () => {
    test('getUnits() returns the units for the given measure', () => {
        expect(getUnits(Measure.Pace)).toEqual([
            {
                abbr: 'min/km',
                measure: 'pace',
                plural: 'Minutes per kilometre',
                singular: 'Minute per kilometre',
                system: 'metric'
            },
            {
                abbr: 'min/mi',
                measure: 'pace',
                plural: 'Minutes per mile',
                singular: 'Minute per mile',
                system: 'imperial'
            }
        ]);
    });

    test('getUnits() returns the units for the given measure and system', () => {
        expect(getUnits(Measure.Pace, UnitSystem.Metric)).toEqual([
            {
                abbr: 'min/km',
                measure: 'pace',
                plural: 'Minutes per kilometre',
                singular: 'Minute per kilometre',
                system: 'metric'
            }
        ]);
    });
});
