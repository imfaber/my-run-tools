import { Plugin } from '@nuxt/types';
import { getModule } from 'vuex-module-decorators';

import RunningEventStoreModule from '~/store/runningEvent.ts';
import SettingsStoreModule from '~/store/settings.ts';
import ToolStoreModule from '~/store/tool.ts';

interface IStoreAccessor {
    $runningEventStore: RunningEventStoreModule;
    $settingsStore: SettingsStoreModule;
    $toolStore: ToolStoreModule;
}

declare module '@nuxt/types' {
    interface Context extends IStoreAccessor {}
}

declare module 'vue/types/vue' {
    interface Vue extends IStoreAccessor {}
}

const storeAccessor: Plugin = ({ store }, inject) => {
    inject('runningEventStore', getModule(RunningEventStoreModule, store));
    inject('settingsStore', getModule(SettingsStoreModule, store));
    inject('toolStore', getModule(ToolStoreModule, store));
};

export default storeAccessor;
