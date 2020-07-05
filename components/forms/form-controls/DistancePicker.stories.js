import DistancePicker from './DistancePicker.vue';

export default {
    title: 'Pickers',
    component: DistancePicker,
    parameters: {
        weight: 0
    }
};

export const distancePicker = () => ({
    components: { DistancePicker },
    created() {
        this.$store.commit('runningEvent/update', []);
    },
    template: '<DistancePicker />'
});
