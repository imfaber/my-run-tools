<template>
    <div
        v-on-clickaway="onClickAway"
        class="time-picker"
        :class="{ 'no-hours': !useHours }"
    >
        <v-text-field
            ref="inputField"
            v-model="computedInputValue"
            shaped
            solo
            :clear-icon="timeDefault !== computedInputValue ? 'mdi-close' : ''"
            clearable
            type="text"
            autocomplete="off"
            v-bind="$attrs"
            @click:clear.stop.prevent="onClear"
            @input="onInput"
            @focus="onFocus"
            @keyup.native.enter="onClickAway"
        ></v-text-field>

        <value-display
            :value="computedDisplayValue"
            :suffix="displayValueSuffix"
            @click="onFocus"
        ></value-display>

        <v-fade-transition>
            <v-time-picker
                v-if="isPickerActive"
                ref="picker"
                v-model="computedPickerValue"
                use-seconds
                scrollable
                full-width
                format="24hr"
                @input="onPickerInput"
            >
                <v-spacer></v-spacer>
                <v-btn fab dark x-small color="primary" @click="onClickAway()">
                    <v-icon dark>mdi-check</v-icon>
                </v-btn>
            </v-time-picker>
        </v-fade-transition>
    </div>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway';
import ValueDisplay from './ValueDisplay';
import {
    formatDurationString,
    isValidDurationFormat,
    stringToMinutes
} from '~/utils/duration.ts';

export default {
    components: { ValueDisplay },

    directives: {
        onClickaway
    },

    inheritAttrs: false,

    props: {
        inputValue: {
            type: String,
            default: ''
        },
        pickerValue: {
            type: String,
            default: ''
        },
        displayValue: {
            type: String,
            default: ''
        },
        displayValueSuffix: {
            type: String,
            default: ''
        },
        useHours: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            timeDefault: this.useHours ? '00:00:00' : '00:00',
            newInputValue: null,
            newPickerValue: null,
            newDisplayValue: null,
            isPickerActive: false
        };
    },
    computed: {
        computedInputValue: {
            get() {
                return this.newInputValue;
            },
            set(value) {
                this.newInputValue = value;
                this.onChange();
            }
        },

        computedPickerValue: {
            get() {
                return this.newPickerValue;
            },
            set(value) {
                this.newPickerValue = value;
                this.computedDisplayValue = value;
            }
        },

        computedDisplayValue: {
            get() {
                return this.newDisplayValue;
            },
            set(value) {
                this.newDisplayValue =
                    this.useHours || !value ? value : value.slice(-5);

                if (
                    stringToMinutes(this.computedInputValue || '') !==
                    stringToMinutes(value || '')
                ) {
                    this.newInputValue = null;
                }
            }
        }
    },

    watch: {
        inputValue(value) {
            this.computedInputValue = value;
        },
        pickerValue(value) {
            this.computedPickerValue = value;
        },
        displayValue(value) {
            this.computedDisplayValue = value;
        }
    },

    created() {
        this.computedDisplayValue = this.displayValue;
        this.computedInputValue = this.inputValue;
        this.computedPickerValue = this.pickerValue || this.timeDefault;
    },

    methods: {
        onInput(value) {
            this.computedPickerValue = value
                ? formatDurationString(value)
                : this.timeDefault;
        },

        onPickerInput() {
            this.computedInputValue = this.newDisplayValue;
        },

        onClear() {
            this.computedInputValue = null;
            this.$emit('clear', this.computedPickerValue);
        },

        onClickAway() {
            this.isPickerActive = false;
            this.$refs.inputField.$el.querySelector('input').blur();
        },

        async onChange() {
            await this.$nextTick();

            if (
                isValidDurationFormat(this.computedPickerValue) &&
                this.computedPickerValue !== this.timeDefault
            ) {
                this.$emit('change', this.computedPickerValue);
            }
        },

        async onFocus() {
            this.isPickerActive = true;
            this.$refs.inputField.$el.querySelector('input').select();

            await this.$nextTick();

            if (!this.useHours && this.$refs.picker) {
                this.$refs.picker.selectingHour = false;
                this.$refs.picker.selectingMinute = true;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
%time-display-value {
    font-size: 40px;
    height: 40px;
    line-height: 40px;
}

.time-picker {
    position: relative;

    .v-picker {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: -72px;
        z-index: 2;
    }

    .time-display {
        padding: 16px;
        color: white;
        background: var(--v-primary-base);
        border-radius: 0 0 16px 16px;
        cursor: pointer;

        .time-display__value {
            @extend %time-display-value;
        }
    }

    &.no-hours ::v-deep {
        .v-time-picker-title__time {
            .v-picker__title__btn:first-child,
            .v-picker__title__btn:first-child + span {
                display: none;
            }
        }
    }

    ::v-deep {
        .v-text-field {
            position: relative;
            z-index: 1;
        }

        .v-input__slot {
            margin-bottom: 0;
            cursor: pointer;
        }

        .v-time-picker-title {
            justify-content: center;
        }

        .v-text-field__details {
            display: none;
        }

        .v-picker__title {
            box-shadow: inset 0px -2px 1px 0px rgba(0, 0, 0, 0.25),
                inset 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
            background: var(--v-primary-base);
        }

        .v-time-picker-title__time {
            .v-picker__title__btn,
            span {
                @extend %time-display-value;
            }
        }

        .v-picker__actions {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
}
</style>
