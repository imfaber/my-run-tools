import { UNIT_SYSTEM_METRIC } from '~/utils/unit-system';

export const state = () => ({
    unitSystem: UNIT_SYSTEM_METRIC,
    darkTheme: false,
    compactNavPanel: true
});

export const mutations = {
    update(state, payload) {
        Object.assign(state, payload);
    }
};

export const actions = {
    set({ commit }, settings) {
        commit('update', { ...settings });
    }
};

export const getters = {};
