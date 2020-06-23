import TimePicker from './TimePicker.vue';

export default {
    title: 'Pickers/Time',
    component: TimePicker,
    parameters: {
        weight: 0
    }
};

export const withoutHours = () => ({
    components: { TimePicker },
    template: '<TimePicker placeholder="Select time"></TimePicker>'
});

export const withHours = () => ({
    components: { TimePicker },
    template: '<TimePicker placeholder="Select time" use-hours></TimePicker>'
});

export const withSuffix = () => ({
    components: { TimePicker },
    template:
        '<TimePicker placeholder="Select time" display-value-suffix="min/km"></TimePicker>'
});
