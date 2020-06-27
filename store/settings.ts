import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { UnitSystem, Settings } from '~/utils/types';

@Module({
    name: 'setting',
    namespaced: true,
    stateFactory: true
})
export default class Setting extends VuexModule {
    unitSystem = UnitSystem.Metric;
    darkTheme = false;
    compactNavPanel = true;

    @Mutation
    update(settings: Settings) {
        Object.assign(this, settings);
    }
}
