import NumberPicker from './NumberPicker.vue';

export default {
    title: 'Pickers',
    component: NumberPicker,
    parameters: {
        weight: 0
    }
};

export const numberPicker = () => ({
    components: { NumberPicker },
    template: '<NumberPicker placeholder="Select number"></NumberPicker>'
});
