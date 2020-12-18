import { directive as onClickaway } from 'vue-clickaway';
import { Framework } from 'vuetify';
import { VTextField } from 'vuetify/lib';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component({
    inheritAttrs: false,
    directives: {
        onClickaway
    }
})
export default class PickerMixin extends Vue {
    /**
     * The display value
     */
    @Prop({ type: [String, Number], default: '' })
    readonly displayValue!: string | number;

    /**
     * The display value suffix
     */
    @Prop({ type: [String, Number], default: '' })
    readonly displayValueSuffix!: string | number;

    $refs!: {
        inputField: InstanceType<typeof VTextField>;
    };

    newInputValue? = '';
    newDisplayValue?: number | string = '';
    defaultDisplayValue?: number | string = '';
    isPickerActive = false;
    isPickerReady = false;
    isReadOnly = (this.$vuetify as Framework).breakpoint.xs;

    created() {
        this.computedDisplayValue =
            this.displayValue ?? this.defaultDisplayValue ?? '';
    }

    get computedInputValue() {
        return this.newInputValue ?? '';
    }

    set computedInputValue(value: string) {
        if (value !== this.newInputValue) {
            this.newInputValue = value;
            this.onChange();
        }
    }

    get computedDisplayValue() {
        return this.newDisplayValue ?? '';
    }

    set computedDisplayValue(value: string | number) {
        this.newDisplayValue = value.toString() || this.defaultDisplayValue;
    }

    get keyboardIcon() {
        if (this.$vuetify.breakpoint.xs && this.isPickerActive) {
            return this.canEdit ? 'mdi-keyboard-close' : 'mdi-keyboard';
        }
        return '';
    }

    get canEdit() {
        return !this.$vuetify.breakpoint.xs || !this.isReadOnly;
    }

    @Watch('displayValue')
    onChildChanged(value: string) {
        this.computedDisplayValue = value;
    }

    onInput(value: string) {
        this.computedDisplayValue = value || 0;
    }

    onPickerInput() {
        this.computedInputValue = this.computedDisplayValue.toString();
    }

    onClear() {
        this.computedDisplayValue = '';
        this.$emit('clear');
    }

    clearInputValue() {
        this.newInputValue = '';
    }

    onClickAway() {
        this.isPickerActive = false;
        this.isPickerReady = false;

        (this.$refs.inputField.$el.querySelector('input') as any).blur();
    }

    async onChange() {
        await this.$nextTick();
        this.$emit('change', this.computedDisplayValue);
    }

    onFocus() {
        this.isPickerActive = true;
        (this.$refs.inputField.$el.querySelector('input') as any).select();
        this.isPickerReady = true;
    }

    toggleReadOnly() {
        this.isReadOnly = !this.isReadOnly;
    }
}
