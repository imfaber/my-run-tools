import { UnitSystem } from '~/utils/types.ts';

export const state = () => ({
    unitSystem: UnitSystem.Metric,
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

export default {
    state,
    mutations,
    actions
};
