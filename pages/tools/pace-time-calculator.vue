<template>
    <ToolSection :title="title" :description="description">
        <ToolWidget cols="12" md="3" title="Distance">
            <DistancePicker @change="onDistanceChange" />
        </ToolWidget>

        <ToolWidget cols="12" md="1" icon="mdi-equal" />

        <ToolWidget cols="12" md="3" title="Time">
            <TimePicker
                ref="timePicker"
                :display-value="timeDisplay"
                placeholder="Enter time"
                use-hours
                @change="calcPace"
                @clear="onTimeClear"
            />
        </ToolWidget>

        <ToolWidget cols="12" md="1" icon="mdi-arrow-left-right" />

        <ToolWidget cols="12" md="3" title="Pace">
            <TimePicker
                ref="pacePicker"
                :display-value="paceDisplay"
                placeholder="Enter pace"
                :display-value-suffix="paceSuffix"
                @change="calcTime"
                @clear="onPaceClear"
            />
        </ToolWidget>
    </ToolSection>
</template>

<script>
import convert from 'convert-units';
import TimePicker from '~/components/forms/form-controls/TimePicker';
import DistancePicker from '~/components/forms/form-controls/DistancePicker';
import ToolWidget from '~/components/ToolWidget';
import ToolSection from '~/components/ToolSection';
import { stringToMinutes, minsToDuration } from '~/utils/duration.ts';
import ToolMixin from '~/mixins/tool';

export default {
    components: {
        TimePicker,
        DistancePicker,
        ToolSection,
        ToolWidget,
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
