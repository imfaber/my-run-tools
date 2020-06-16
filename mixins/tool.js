import tools from '~/data/tools';
import { UNIT_SYSTEM_METRIC } from '~/utils/unit-system';

export default {
    head() {
        const { title } = tools.find((x) => x.name === this.$route.name);
        return {
            title
        };
    },

    computed: {
        unitSystem() {
            return this.$store.state.settings.unitSystem;
        },

        isMetricSystem() {
            return this.unitSystem === UNIT_SYSTEM_METRIC;
        }
    }
};
