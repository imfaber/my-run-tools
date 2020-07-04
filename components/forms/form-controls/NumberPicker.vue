<template>
    <div v-on-clickaway="onClickAway" class="number-picker">
        <VTextField
            ref="inputField"
            v-model="computedInputValue"
            :min="min"
            :max="max"
            shaped
            solo
            clear-icon="mdi-close"
            clearable
            type="number"
            autocomplete="off"
            v-bind="$attrs"
            :append-icon="keyboardIcon"
            :readonly="!canEdit"
            @click:append.stop.prevent="toggleReadOnly"
            @click:clear.stop.prevent="onClear"
            @input="onInput"
            @focus="onFocus"
            @keyup.native.enter="onClickAway"
        />

        <ValueDisplay
            :value="computedDisplayValue"
            :suffix="displayValueSuffix"
            @click="onFocus"
        />

        <VFadeTransition>
            <VCard v-if="isPickerActive" class="picker">
                <div class="picker__title">
                    <div>
                        {{ computedDisplayValue }}
                        <small v-if="displayValueSuffix">{{
                            displayValueSuffix
                        }}</small>
                    </div>
                </div>
                <div class="picker__body pa-2">
                    <VSlider
                        v-model="computedDisplayValue"
                        class="mt-4"
                        append-icon="mdi-plus"
                        prepend-icon="mdi-minus"
                        :min="min"
                        :max="max"
                        :step="step"
                        @click:append="increase"
                        @click:prepend="decrease"
                        @change="onPickerInput"
                        @start="onSliderStart"
                        @end="onSliderEnd"
                        @click="onSliderClick"
                    />

                    <div>
                        <VBtn
                            class="btn--done mt-2 mx-auto d-block"
                            fab
                            dark
                            x-small
                            color="primary"
                            @click="onClickAway()"
                        >
                            <v-icon dark>mdi-check</v-icon>
                        </VBtn>
                    </div>
                </div>
            </VCard>
        </VFadeTransition>
    </div>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import PickerMixin from '~/mixins/picker';

@Component
export default class ToolSection extends Mixins(PickerMixin) {
    @Prop({ type: [Number, String] }) readonly min: number | string | undefined;
    @Prop({ type: [Number, String] }) readonly max: number | string | undefined;

    defaultDisplayValue = 0;
    step = 0.1;

    onSliderStart() {
        this.step = 1;
    }

    onSliderEnd() {
        this.step = 0.1;
    }

    onSliderClick() {
        this.computedDisplayValue = Math.round(
            parseFloat(this.computedDisplayValue.toString())
        );
        this.computedInputValue = this.computedDisplayValue.toString();
    }

    increase() {
        (this.computedDisplayValue as number)++;
        this.onPickerInput();
    }

    decrease() {
        (this.computedDisplayValue as number)--;
        this.onPickerInput();
    }
}
</script>

<style lang="scss" scoped>
.number-picker {
    position: relative;

    .picker {
        background: white;
        position: absolute;
        top: 48px;
        left: 0;
        right: 0;
        z-index: 2;
        border-radius: 0 0 16px 16px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
            0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 5px 5px 0px rgba(0, 0, 0, 0.12);

        .picker__title {
            box-shadow: inset 0px -2px 1px 0px rgba(0, 0, 0, 0.25),
                inset 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
            background: var(--v-primary-base);
            height: 72px;
            font-size: 40px;
            color: white;
            align-items: center;
            justify-content: center;
            display: flex;
            padding: 16px;

            small {
                font-size: 50%;
            }
        }
    }

    ::v-deep {
        .v-text-field {
            position: relative;
            z-index: 1;

            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            /* Firefox */
            input[type='number'] {
                -moz-appearance: textfield;
            }
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
    }
}
</style>
