<template>
    <div
        v-on-clickaway="onClickAway"
        class="time-picker"
        :class="{
            'no-hours': !useHours,
            'picker-ready': isPickerReady,
            [displayValueSuffix
                .toLowerCase()
                .replace(/\//g, '-')]: !!displayValueSuffix
        }"
    >
        <VTextField
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
            :append-icon="keyboardIcon"
            :readonly="!canEdit"
            @click:append.stop.prevent="toggleReadOnly"
            @click:clear.stop.prevent="onClear"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keyup.native.enter="onClickAway"
        />

        <ValueDisplay
            :value="formattedDisplayValue"
            :suffix="displayValueSuffix"
            @click="onFocus"
        />

        <VTimePicker
            v-if="isPickerActive"
            ref="picker"
            v-model="computedDisplayValue"
            use-seconds
            scrollable
            full-width
            :format="useHours ? '24hr' : 'ampm'"
            @input="onPickerInput"
        >
            <VSpacer />
            <VBtn
                class="btn--done"
                fab
                dark
                x-small
                color="primary"
                @click="onClickAway()"
            >
                <VIcon dark>mdi-check</VIcon>
            </VBtn>
        </VTimePicker>

        <VProgressLinear
            :active="loading"
            indeterminate
            absolute
            bottom
            color="white"
        />
    </div>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import { VTextField } from 'vuetify/lib';
import PickerMixin from '~/mixins/picker';
import {
    formatDurationString,
    isValidDurationString
} from '~/utils/duration.ts';

@Component
export default class TimePicker extends Mixins(PickerMixin) {
    @Prop({ type: Boolean, default: false }) readonly useHours!: boolean;

    $refs!: {
        inputField: InstanceType<typeof VTextField>;
    };

    defaultDisplayValue = this.useHours ? '00:00:00' : '00:00';
    loading = false;

    get formattedDisplayValue() {
        return this.getFormattedValue(this.computedDisplayValue.toString());
    }

    onInput(value: string) {
        if (value && !isValidDurationString(value)) {
            return;
        }

        this.computedDisplayValue = value
            ? formatDurationString(value)
            : this.defaultDisplayValue;
    }

    onBlur() {
        if (
            this.computedInputValue &&
            !isValidDurationString(this.computedInputValue)
        ) {
            this.onPickerInput();
        }
    }

    onPickerInput() {
        this.computedInputValue = this.getFormattedValue(
            this.computedDisplayValue.toString()
        );
    }

    async onChange() {
        await this.$nextTick();

        if (
            isValidDurationString(this.computedDisplayValue.toString()) &&
            this.computedDisplayValue !== this.defaultDisplayValue
        ) {
            this.$emit('change', this.computedDisplayValue);
        }
    }

    async onFocus() {
        this.isPickerActive = true;
        this.loading = true;

        const inputElem = this.$refs.inputField.$el.querySelector('input');
        if (inputElem) {
            inputElem.select();
        }

        await this.$nextTick();

        if (!this.useHours && 'picker' in this.$refs) {
            (this.$refs as any).picker.selectingHour = false;
            (this.$refs as any).picker.selectingMinute = true;
        }

        setTimeout(() => {
            this.isPickerReady = true;
        }, 500);

        setTimeout(() => {
            this.loading = false;
        }, 1000);
    }

    getFormattedValue(value: string) {
        return this.useHours ? value : value.slice(-5);
    }
}
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
        margin-bottom: 25px;
        z-index: 2;
        border-radius: 0 0 16px 16px;
        overflow: hidden;
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

        .v-time-picker-title__ampm,
        .v-time-picker-clock__ampm {
            display: none;
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

        .v-time-picker-clock {
            transition: opacity 0.6s ease;
            opacity: 0;
        }

        .v-picker__actions {
            position: absolute;
            bottom: 0;
            right: 0;
        }

        .v-progress-linear--absolute {
            position: absolute;
            z-index: 2;
        }
    }

    &.picker-ready ::v-deep {
        .v-time-picker-clock {
            opacity: 1;
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
