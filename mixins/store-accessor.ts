import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import runningEvent from '~/store/runningEvent.ts';
import settings from '~/store/settings.ts';
import tool from '~/store/tool.ts';

@Component
export default class StoreAccessorMixin extends Vue {
    runningEventStore = getModule(runningEvent, this.$store);
    settingsStore = getModule(settings, this.$store);
    toolStore = getModule(tool, this.$store);
}
