import Vue from 'vue';
import Vuex from 'vuex';
import runningEvent from '@/store/runningEvent.ts';
import settings from '@/store/settings.ts';
import tool from '@/store/tool.ts';

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {},
    modules: {
        runningEvent,
        settings,
        tool
    }
});

export default store;
