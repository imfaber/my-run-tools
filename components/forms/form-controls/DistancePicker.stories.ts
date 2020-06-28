import DistancePicker from './DistancePicker.vue';
import store from '~/.storybook/store';

export default {
    title: 'Pickers',
    component: DistancePicker,
    parameters: {
        weight: 0
    }
};

export const distancePicker = () => ({
    components: { DistancePicker },
    store,
    template: '<DistancePicker />'
});
