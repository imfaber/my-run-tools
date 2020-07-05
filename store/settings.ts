import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { UnitSystem, SettingsOptions } from '~/utils/types';

@Module({
    name: 'settings',
    namespaced: true,
    stateFactory: true
})
export default class Settings extends VuexModule {
    unitSystem = UnitSystem.Metric;
    darkTheme = false;
    compactNavPanel = true;

    @Mutation
    update(settings: SettingsOptions) {
        Object.assign(this, settings);
    }
}
