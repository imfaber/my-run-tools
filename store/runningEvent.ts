import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { v1 as uuid } from 'uuid';
import runningEvents from '~/data/running-events.ts';
import { RunningEvent as Event } from '~/utils/types';
import { lengthMetricUnits, lengthImperialUnits } from '~/utils/unit-system';

@Module({
    name: 'runningEvent',
    namespaced: true,
    stateFactory: true
})
export default class RunningEvent extends VuexModule {
    events = [...runningEvents];

    @Mutation
    update(event: Event) {
        Object.assign(this.events, event);
    }

    @Mutation
    addEvent(event: Event): Event {
        const newEvent = {
            ...event,
            id: uuid(),
            isCustom: true
        } as Event;

        this.events.unshift(newEvent);
        return newEvent;
    }

    @Mutation
    editEvent(event: Event) {
        const index = this.context.getters.getEventIndex(event.id);
        Object.assign(this.events[index], { ...event });
    }

    @Mutation
    deleteEvent(event: Event) {
        this.events.splice(this.context.getters.getEventIndex(event.id), 1);
    }

    get ciao() {
        return 'ciao';
    }

    get getEventById() {
        return (id: string) => this.events.find((e) => e.id === id);
    }

    get getEventByName() {
        return (name: string) => this.events.find((e) => e.name === name);
    }

    get getEventIndex() {
        return (id: string) => this.events.findIndex((e) => e.id === id);
    }

    get getMetricEvents() {
        return this.events.filter((e) => lengthMetricUnits.includes(e.unit));
    }

    get getImperialEvents() {
        return this.events.filter((e) => lengthImperialUnits.includes(e.unit));
    }
}
