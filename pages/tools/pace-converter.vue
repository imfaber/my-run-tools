<template>
    <v-row align="center" justify="center">
        <v-col cols="12" class="text-center mb-8">
            <h1 class="font-weight-regular">Pace Converter</h1>

            <div class="font-weight-light title">
                Fill any field to convert the others.
            </div>
        </v-col>
        <v-col cols="12" md="3">
            <h2 class="font-weight-regular mb-4 text-center">Metric pace</h2>
            <time-picker
                ref="metricPace"
                :display-value="metricPace"
                placeholder="Enter pace"
                display-value-suffix="min/km"
                @change="onMetricPaceChange"
                @clear="onClear"
            ></time-picker>
        </v-col>

        <v-col cols="12" md="3">
            <h2 class="font-weight-regular mb-4 text-center">Imperial pace</h2>
            <time-picker
                ref="imperialPace"
                :display-value="imperialPace"
                display-value-suffix="min/mi"
                placeholder="Enter pace"
                @change="onImperialPaceChange"
                @clear="onClear"
            ></time-picker>
        </v-col>

        <v-col cols="12" md="3">
            <h2 class="font-weight-regular mb-4 text-center">Metric speed</h2>
            <number-picker
                ref="metricSpeed"
                :display-value="metricSpeed"
                display-value-suffix="km/h"
                placeholder="Enter speed"
                @change="onMetricSpeedChange"
                @clear="onClear"
            ></number-picker>
        </v-col>

        <v-col cols="12" md="3">
            <h2 class="font-weight-regular mb-4 text-center">Imperial speed</h2>
            <number-picker
                ref="imperialSpeed"
                :display-value="imperialSpeed"
                display-value-suffix="mph"
                placeholder="Enter speed"
                @change="onImperialSpeedChange"
                @clear="onClear"
            ></number-picker>
        </v-col>
    </v-row>
</template>

<script>
import convert from 'convert-units';
import TimePicker from '~/components/forms/form-controls/TimePicker';
import NumberPicker from '~/components/forms/form-controls/NumberPicker';
import { stringToMinutes, minsToDuration } from '~/utils/duration.ts';
import ToolMixin from '~/mixins/tool';

export default {
    components: {
        TimePicker,
        NumberPicker
    },

    mixins: [ToolMixin],

    data() {
        return {
            defaultPace: '00:00',
            defaultSpeed: 0,
            imperialSpeed: null,
            metricSpeed: null,
            imperialPace: null,
            metricPace: null
        };
    },

    methods: {
        convertPace(value, from, to) {
            const timeInMins = stringToMinutes(value);

            const convertedPaceMins = convert(timeInMins)
                .from(from)
                .to(to);
            return minsToDuration(convertedPaceMins);
        },

        convertSpeed(value, from, to) {
            return convert(value)
                .from(from)
                .to(to)
                .toFixed(1);
        },

        paceToSpeed(value) {
            return (60 / stringToMinutes(value)).toFixed(1);
        },

        speedToPace(value) {
            return minsToDuration(3600 / (60 * value));
        },

        onImperialPaceChange(value) {
            this.metricPace = this.convertPace(value, 'min/mi', 'min/km');
            this.metricSpeed = this.paceToSpeed(this.metricPace);
            this.imperialSpeed = this.paceToSpeed(value);
            this.$refs.imperialSpeed.clearInputValue();
            this.$refs.metricSpeed.clearInputValue();
            this.$refs.metricPace.clearInputValue();
        },

        onMetricPaceChange(value) {
            this.imperialPace = this.convertPace(value, 'min/km', 'min/mi');
            this.metricSpeed = this.paceToSpeed(value);
            this.imperialSpeed = this.paceToSpeed(this.imperialPace);
            this.$refs.imperialSpeed.clearInputValue();
            this.$refs.metricSpeed.clearInputValue();
            this.$refs.imperialPace.clearInputValue();
        },

        onMetricSpeedChange(value) {
            this.imperialSpeed = this.convertSpeed(value, 'km', 'mi');
            this.metricPace = this.speedToPace(value);
            this.imperialPace = this.speedToPace(this.imperialSpeed);
            this.$refs.imperialSpeed.clearInputValue();
            this.$refs.imperialPace.clearInputValue();
            this.$refs.metricPace.clearInputValue();
        },

        onImperialSpeedChange(value) {
            this.metricSpeed = this.convertSpeed(value, 'mi', 'km');
            this.imperialPace = this.speedToPace(value);
            this.metricPace = this.speedToPace(this.metricSpeed);
            this.$refs.metricSpeed.clearInputValue();
            this.$refs.imperialPace.clearInputValue();
            this.$refs.metricPace.clearInputValue();
        },

        onClear() {
            this.$refs.imperialSpeed.clearInputValue();
            this.$refs.metricSpeed.clearInputValue();
            this.$refs.imperialPace.clearInputValue();
            this.$refs.metricPace.clearInputValue();
            this.imperialSpeed = this.defaultSpeed;
            this.metricSpeed = this.defaultSpeed;
            this.imperialPace = this.defaultPace;
            this.metricPace = this.defaultPace;
        }
    }
};
</script>
