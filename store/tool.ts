import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Tool } from '~/utils/types';

@Module({
    name: 'tool',
    namespaced: true,
    stateFactory: true
})
export default class Setting extends VuexModule {
    list: Array<Tool> = [];

    @Mutation
    setList(list: Array<Tool>) {
        this.list = list;
    }
}
