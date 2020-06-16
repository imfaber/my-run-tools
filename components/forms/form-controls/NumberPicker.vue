<template>
    <div v-on-clickaway="onClickAway" class="number-picker">
        <v-text-field
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
            <v-card v-if="isPickerActive" class="picker">
                <div class="picker__title">
                    <div>
                        {{ computedDisplayValue }}
                        <small v-if="displayValueSuffix">{{
                            displayValueSuffix
                        }}</small>
                    </div>
                </div>
                <div class="picker__body pa-2">
                    <v-slider
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
                    ></v-slider>
                </div>
            </v-card>
        </v-fade-transition>
    </div>
</template>

<script>
import PickerMixin from '~/mixins/picker';

export default {
    mixins: [PickerMixin],

    props: {
        min: {
            type: [Number, String],
            default: 0
        },
        max: {
            type: [Number, String],
            default: 50
        }
    },

    data() {
        return {
            defaultDisplayValue: 0,
            step: 0.1
        };
    },

    methods: {
        onSliderStart() {
            this.step = 1;
        },

        onSliderEnd() {
            this.step = 0.1;
        },

        onSliderClick() {
            this.computedDisplayValue = Math.round(this.computedDisplayValue);
            this.computedInputValue = this.computedDisplayValue;
        },

        increase() {
            this.computedDisplayValue++;
            this.onPickerInput();
        },

        decrease() {
            this.computedDisplayValue--;
            this.onPickerInput();
        }
    }
};
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
