import tools from '~/data/tools.ts';
import { UnitSystem } from '~/utils/types.ts';

export default {
    head() {
        return {
            title: this.title,
            description: this.description
        };
    },

    data() {
        return {
            ...tools.find((x) => x.id === this.$route.name)
        };
    },

    computed: {
        unitSystem() {
            return this.$store.state.settings.unitSystem;
        },

        isMetricSystem() {
            return this.unitSystem === UnitSystem.Metric;
        }
    }
};
