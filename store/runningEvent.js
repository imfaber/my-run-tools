import { v1 as uuid } from 'uuid';
import runningEvents from '~/data/running-events.ts';
import { lengthMetricUnits, lengthImperialUnits } from '~/utils/unit-system.ts';

export const state = () => ({
    events: [...runningEvents]
});

export const mutations = {
    update(state, payload) {
        Object.assign(state, payload);
    },

    addEvent(state, payload) {
        state.events.unshift(payload);
    },

    editEvent(state, payload) {
        Object.assign(state.events[payload.index], { ...payload.event });
    },

    deleteEvent(state, payload) {
        state.events.splice(payload, 1);
    }
};

export const actions = {
    addEvent({ commit, state }, event) {
        commit('addEvent', {
            ...event,
            id: uuid(),
            isCustom: true
        });

        return state.events[0];
    },

    editEvent({ commit, getters }, event) {
        const index = getters.getEventIndex(event.id);

        commit('editEvent', {
            index,
            event
        });

        return event;
    },

    deleteEvent({ commit }, id) {
        commit('deleteEvent', getters.getEventIndex(id));
    }
};

export const getters = {
    getEventById: (state) => (id) => state.events.find((e) => e.id === id),

    getEventByName: (state) => (name) =>
        state.events.find((e) => e.name === name),

    getEventIndex: (state) => (id) =>
        state.events.findIndex((e) => e.id === id),

    getMetricEvents: (state) => {
        return state.events.filter((e) => lengthMetricUnits.includes(e.unit));
    },

    getImperialEvents: (state) => {
        return state.events.filter((e) => lengthImperialUnits.includes(e.unit));
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
