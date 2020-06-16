<template>
    <v-row align="center" justify="center">
        <v-col cols="12" class="text-center mb-8">
            <h1 class="font-weight-regular">Pace/Time Calculator</h1>

            <div class="font-weight-light title">
                Enter distance and time or pace, to calculate the pace or time,
                respectively.
            </div>
        </v-col>

        <v-col cols="12" md="3">
            <h2 class="font-weight-regular mb-4 text-center">Distance</h2>
            <distance-picker @change="onDistanceChange"></distance-picker>
        </v-col>

        <v-col cols="12" md="1" class="text-center">
            <v-icon class="mt-md-12" large>mdi-equal</v-icon>
        </v-col>

        <v-col cols="12" md="3">
            <h2 class="font-weight-regular mb-4 text-center">Time</h2>
            <time-picker
                ref="timePicker"
                :display-value="timeDisplay"
                placeholder="Enter time"
                use-hours
                @change="calcPace"
                @clear="onTimeClear"
            ></time-picker>
        </v-col>

        <v-col cols="12" md="1" class="text-center">
            <v-icon class="mt-md-12" large>mdi-arrow-left-right</v-icon>
        </v-col>

        <v-col cols="12" md="3">
            <h2 class="font-weight-regular mb-4 text-center">Pace</h2>
            <time-picker
                ref="pacePicker"
                :display-value="paceDisplay"
                placeholder="Enter pace"
                :display-value-suffix="paceSuffix"
                @change="calcTime"
                @clear="onPaceClear"
            ></time-picker>
        </v-col>
    </v-row>
</template>

<script>
import convert from 'convert-units';
import TimePicker from '~/components/forms/form-controls/TimePicker';
import DistancePicker from '~/components/forms/form-controls/DistancePicker';
import { stringToMinutes, minsToDuration } from '~/utils/duration.ts';
import ToolMixin from '~/mixins/tool';

export default {
    components: {
        TimePicker,
        DistancePicker
    },

    mixins: [ToolMixin],

    data() {
        return {
            defaultTime: '00:00:00',
            defaultPace: '00:00',
            distance: null,
            timeDisplay: null,
            timeInput: null,
            paceDisplay: null,
            paceInput: null
        };
    },

    computed: {
        distanceValue() {
            const distance = this.$store.getters['runningEvent/getEventById'](
                this.distance
            );

            if (!distance) {
                return;
            }

            return convert(distance.value)
                .from(distance.unit)
                .to(this.isMetricSystem ? 'km' : 'mi');
        },

        paceSuffix() {
            this.calc();
            return this.isMetricSystem ? 'min/km' : 'min/mi';
        }
    },

    methods: {
        onDistanceChange(value) {
            this.distance = value;

            if (!value) {
                if (!this.timeInput) {
                    this.timeDisplay = this.defaultTime;
                    this.timeInput = null;
                }

                if (!this.paceInput) {
                    this.paceDisplay = this.defaultPace;
                    this.paceInput = null;
                }

                return;
            }

            this.calc();
        },

        onTimeClear() {
            this.timeInput = null;
            this.paceInput = null;
            this.paceDisplay = this.defaultPace;
        },

        onPaceClear() {
            this.paceInput = null;
            this.timeInput = null;
            this.timeDisplay = this.defaultTime;
        },

        calc() {
            if (!this.distance) {
                return;
            }

            if (this.timeInput && !this.paceInput) {
                this.calcPace(this.timeInput);
            }

            if (!this.timeInput && this.paceInput) {
                this.calcTime(this.paceInput);
            }
        },

        calcPace(time) {
            this.$refs.pacePicker.clearInputValue();
            this.timeInput = time;
            this.paceInput = null;

            if (!this.distance || !time || time === this.defaultTime) {
                return;
            }

            const timeInMins = stringToMinutes(time);
            const pace = timeInMins / this.distanceValue;
            const duration = minsToDuration(pace);
            this.paceDisplay = duration || this.defaultPace;
        },

        calcTime(pace) {
            this.$refs.timePicker.clearInputValue();
            this.timeInput = null;
            this.paceInput = pace;

            if (!this.distance || !pace || pace === this.defaultPace) {
                return;
            }

            const paceInMins = stringToMinutes(pace);
            const time = paceInMins * this.distanceValue;
            const duration = minsToDuration(time);
            this.timeDisplay = duration || this.defaultTime;
        }
    }
};
</script>
