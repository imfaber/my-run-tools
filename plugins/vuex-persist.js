import VuexPersistence from 'vuex-persist';
import Vue from 'vue';

const STORAGE_KEY = 'RUN_TOOLS';

Vue.use({
    install(Vue) {
        Vue.mixin({
            mounted() {
                // Nuxt seems to have some problem in restoring
                // the store when using the reducer so I restore
                // the store manually in the mounted hook to also
                // avoid Vue warnings about the virtual DOM tree
                // not matching server-rendered content.
                const localState = JSON.parse(
                    window.localStorage.getItem(STORAGE_KEY)
                );

                if (localState) {
                    setTimeout(() => {
                        if (!('$store' in this)) return;
                        this.$store.commit('settings/update', {
                            ...localState.settings
                        });
                        this.$store.commit('runningEvent/update', {
                            events: localState.eventsList
                        });
                    });
                }
            }
        });
    }
});

export default ({ store }) => {
    return new VuexPersistence({
        key: STORAGE_KEY,
        reducer: (state) => ({
            settings: state.settings,
            eventsList: state.runningEvent.events
        })
    }).plugin(store);
};
