import Vuex from 'vuex';
import runningEvent from '@/store/runningEvent.js';
import settings from '@/store/settings.js';
import tool from '@/store/tool.js';

let store = new Vuex.Store({
    state: {},
    modules: {
        runningEvent: {
            namespaced: true,
            ...runningEvent
        },
        settings: {
            namespaced: true,
            ...settings
        },
        tool: {
            namespaced: true,
            ...tool
        }
    }
});

export default store;
