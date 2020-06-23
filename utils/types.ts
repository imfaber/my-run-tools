export enum UnitSystem {
    Metric = 'metric',
    Imperial = 'imperial'
}

export enum UnitAbbreviation {
    Meter = 'm',
    Kilometer = 'km',
    Yard = 'yd',
    Mile = 'mi',
    Minute = 'min'
}

export enum Measure {
    Length = 'length',
    Pace = 'pace',
    Time = 'time',
    Speed = 'speed'
}

export interface Duration {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface Tool {
    id: string;
    title: string;
    description: string;
}

export interface RunningEvent {
    id: string;
    name: string;
    value: number;
    unit: UnitAbbreviation;
    isCustom?: boolean;
}
