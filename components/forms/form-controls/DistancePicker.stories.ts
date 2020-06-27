import DistancePickerTs from './DistancePickerTs.vue';
import store from '~/.storybook/store';

export default {
    title: 'Pickers',
    component: DistancePickerTs,
    parameters: {
        weight: 0
    }
};

export const distancePickerTs = () => ({
    components: { DistancePickerTs },
    store,
    template: '<DistancePickerTs />'
});
