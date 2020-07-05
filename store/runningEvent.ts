import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
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
    events: Array<Event> = [];

    @Mutation
    update(events: Array<Event>) {
        this.events = events.length ? events : runningEvents;
    }

    @Mutation
    addEvent(event: Event) {
        this.events = [event, ...this.events];
    }

    @Mutation
    editEvent({ event, index }: { event: Event; index: number }) {
        this.events[index] = event;
        this.events = [...this.events];
    }

    @Mutation
    deleteEvent(index: number) {
        this.events.splice(index, 1);
    }

    @Action
    add(event: Event): Event {
        const newEvent = {
            ...event,
            id: uuid(),
            isCustom: true
        } as Event;

        this.context.commit('addEvent', newEvent);
        return newEvent;
    }

    @Action
    edit(event: Event): Event {
        const index = this.context.getters.getEventIndex(event.id);
        this.context.commit('editEvent', { event, index });
        return this.events[index];
    }

    @Action
    delete(event: Event) {
        const index = this.context.getters.getEventIndex(event.id);
        this.context.commit('deleteEvent', index);
    }

    get getEventById() {
        return (id: string | undefined) => this.events.find((e) => e.id === id);
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
