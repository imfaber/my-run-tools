import VuexPersistence from 'vuex-persist';

const STORAGE_KEY = 'RUN_TOOLS';

export default ({ store }) => {
    // Nuxt seems to have some problem in restoring
    // the store when using the reducer so I restore
    // the store manually in the mounted hook to also
    // avoid Vue warnings about the virtual DOM tree
    // not matching server-rendered content.
    const localState = JSON.parse(window.localStorage.getItem(STORAGE_KEY));

    if (localState) {
        setTimeout(() => {
            store.commit('settings/update', {
                ...localState.settings
            });
            store.commit('runningEvent/update', localState.eventsList);
        });
    }

    return new VuexPersistence({
        key: STORAGE_KEY,
        reducer: (state) => ({
            settings: state.settings,
            eventsList: state.runningEvent.events
        })
    }).plugin(store);
};
