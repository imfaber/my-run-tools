<template>
    <div v-on-clickaway="onClickAway" class="time-picker">
        <v-text-field
            ref="inputField"
            v-model="time"
            shaped
            solo
            :clear-icon="timeDefault !== time ? 'mdi-close-circle' : ''"
            clearable
            :placeholder="placeholder"
            type="text"
            @click:clear.stop.prevent="onClear"
            @input="onInput"
            @focus="onFocus"
            @keyup.native.enter="onClickAway"
        ></v-text-field>

        <div class="time-display" @click="onFocus">
            <div class="time-display__value">
                {{ timeDisplay }}
            </div>
        </div>

        <v-time-picker
            v-if="isPickerActive"
            v-model="pickerTime"
            use-seconds
            scrollable
            full-width
            format="24hr"
            @input="onPickerInput"
        >
            <v-spacer></v-spacer>
            <v-btn fab dark small color="green" @click="onClickAway()">
                <v-icon dark>mdi-check</v-icon>
            </v-btn>
        </v-time-picker>
    </div>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway';
import parseDuration from 'parse-duration';

export default {
    directives: {
        onClickaway
    },

    props: {
        placeholder: {
            type: String,
            default: 'E.g. 5m, 1.5h, 1h 30m, 01:30:00 etc...'
        }
    },

    data() {
        return {
            time: null,
            timeDefault: '00:00:00',
            pickerTime: null,
            isPickerActive: false
        };
    },

    computed: {
        timeDisplay() {
            return this.pickerTime !== this.timeDefault
                ? this.pickerTime
                : '-- : -- : --';
        }
    },

    created() {
        this.onClear();
    },

    methods: {
        isValidTimeFormat(value) {
            return /^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/.test(value);
        },
        onInput(value) {
            if (!value) {
                return;
            }

            if (this.isValidTimeFormat(value)) {
                this.pickerTime = value;
            } else {
                const date = new Date(parseDuration(value));
                const parsedTimeString = date.toISOString().slice(11, 19);
                this.pickerTime = parsedTimeString;
            }
        },
        onPickerInput(value) {
            this.time = value;
        },
        async onClear() {
            await this.$nextTick();
            this.time = null;
            this.pickerTime = this.timeDefault;
        },
        onClickAway() {
            this.isPickerActive = false;
            this.$refs.inputField.$el.querySelector('input').blur();
        },
        onFocus() {
            this.isPickerActive = true;
            this.$refs.inputField.$el.querySelector('input').select();
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
        transform: translateY(-72px);
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
}

::v-deep {
    .v-text-field {
        position: relative;
        z-index: 1;
    }

    .v-input input {
        text-align: center;
        padding-left: 24px;
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
        box-shadow: inset 0px -2px 1px 0px rgba(0, 0, 0, 0.25);
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
</style>
