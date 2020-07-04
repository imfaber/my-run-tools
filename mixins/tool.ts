import { Component, Mixins } from 'vue-property-decorator';
import StoreAccessorMixin from './store-accessor';
import toolsData from '~/data/tools.ts';
import { UnitSystem } from '~/utils/types.ts';

@Component({
    asyncData({ route }) {
        const tool = toolsData.find((x) => x.id === route.name);
        return { ...tool };
    },
    head() {
        return {
            ...toolsData.find((x) => x.id === this.$route.name)
        };
    }
})
export default class ToolMixin extends Mixins(StoreAccessorMixin) {
    get unitSystem(): UnitSystem {
        return this.$store.state.settings.unitSystem;
    }

    get isMetricSystem() {
        return this.unitSystem === UnitSystem.Metric;
    }
}
