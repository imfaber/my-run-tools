<template>
    <div
        v-on-clickaway="onClickAway"
        class="time-picker"
        :class="{
            'no-hours': !useHours,
            [displayValueSuffix
                .toLowerCase()
                .replace(/\//g, '-')]: !!displayValueSuffix
        }"
    >
        <v-text-field
            ref="inputField"
            v-model="computedInputValue"
            shaped
            solo
            :clear-icon="
                defaultDisplayValue !== computedInputValue ? 'mdi-close' : ''
            "
            clearable
            type="text"
            autocomplete="off"
            v-bind="$attrs"
            @click:clear.stop.prevent="onClear"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keyup.native.enter="onClickAway"
        ></v-text-field>

        <value-display
            :value="formattedDisplayValue"
            :suffix="displayValueSuffix"
            @click="onFocus"
        ></value-display>

        <v-fade-transition>
            <v-time-picker
                v-if="isPickerActive"
                ref="picker"
                v-model="computedDisplayValue"
                use-seconds
                scrollable
                full-width
                format="24hr"
                @input="onPickerInput"
            >
                <v-spacer></v-spacer>
                <v-btn
                    class="btn--done"
                    fab
                    dark
                    x-small
                    color="primary"
                    @click="onClickAway()"
                >
                    <v-icon dark>mdi-check</v-icon>
                </v-btn>
            </v-time-picker>
        </v-fade-transition>
    </div>
</template>

<script>
import PickerMixin from '~/mixins/picker';
import {
    formatDurationString,
    isValidDurationString
} from '~/utils/duration.ts';

export default {
    mixins: [PickerMixin],

    props: {
        useHours: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            defaultDisplayValue: this.useHours ? '00:00:00' : '00:00'
        };
    },
    computed: {
        formattedDisplayValue() {
            return this.getFormattedValue(this.computedDisplayValue);
        }
    },

    methods: {
        onInput(value) {
            if (value && !isValidDurationString(value)) {
                return;
            }

            this.computedDisplayValue = value
                ? formatDurationString(value)
                : this.defaultDisplayValue;
        },

        onBlur() {
            if (
                this.computedInputValue &&
                !isValidDurationString(this.computedInputValue)
            ) {
                this.onPickerInput();
            }
        },

        onPickerInput() {
            this.computedInputValue = this.getFormattedValue(
                this.computedDisplayValue
            );
        },

        async onChange() {
            await this.$nextTick();

            if (
                isValidDurationString(this.computedDisplayValue) &&
                this.computedDisplayValue !== this.defaultDisplayValue
            ) {
                this.$emit('change', this.computedDisplayValue);
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
        },

        getFormattedValue(value) {
            return this.useHours ? value : value.slice(-5);
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

            &:after {
                font-size: 20px;
                margin-left: 10px;
                margin-top: 13px;
            }
        }

        .v-picker__actions {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }

    &.min-mi ::v-deep .v-time-picker-title__time:after {
        content: 'min/mi';
    }

    &.min-km ::v-deep .v-time-picker-title__time:after {
        content: 'min/km';
    }
}
</style>
