import { directive as onClickaway } from 'vue-clickaway';
import ValueDisplay from '~/components/forms/form-controls/ValueDisplay';

export default {
    components: { ValueDisplay },

    directives: {
        onClickaway
    },

    inheritAttrs: false,

    props: {
        displayValue: {
            type: [String, Number],
            default: ''
        },
        displayValueSuffix: {
            type: [String, Number],
            default: ''
        }
    },

    data() {
        return {
            newInputValue: null,
            newDisplayValue: null,
            defaultDisplayValue: null,
            isPickerActive: false
        };
    },

    computed: {
        computedInputValue: {
            get() {
                return this.newInputValue;
            },
            set(value) {
                if (value !== this.newInputValue) {
                    this.newInputValue = value;
                    this.onChange();
                }
            }
        },

        computedDisplayValue: {
            get() {
                return this.newDisplayValue;
            },
            set(value) {
                this.newDisplayValue = value || this.defaultDisplayValue;
            }
        }
    },

    watch: {
        displayValue(value) {
            this.computedDisplayValue = value;
        }
    },

    created() {
        this.computedDisplayValue =
            this.displayValue || this.defaultDisplayValue;
    },

    methods: {
        onInput(value) {
            this.computedDisplayValue = value || 0;
        },

        onPickerInput() {
            this.computedInputValue = this.computedDisplayValue;
        },

        onClear() {
            this.computedDisplayValue = null;
            this.$emit('clear');
        },

        clearInputValue() {
            this.newInputValue = null;
        },

        onClickAway() {
            this.isPickerActive = false;
            this.$refs.inputField.$el.querySelector('input').blur();
        },

        async onChange() {
            await this.$nextTick();
            this.$emit('change', this.computedDisplayValue);
        },

        onFocus() {
            this.isPickerActive = true;
            this.$refs.inputField.$el.querySelector('input').select();
        }
    }
};
