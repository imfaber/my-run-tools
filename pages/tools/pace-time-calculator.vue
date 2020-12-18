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

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import convert from 'convert-units';
import PickerMixin from '~/mixins/picker';
import { stringToMinutes, minsToDuration } from '~/utils/duration.ts';
import ToolMixin from '~/mixins/tool.ts';

@Component
export default class PaceTimeCalculator extends Mixins(ToolMixin) {
    $refs!: {
        pacePicker: InstanceType<typeof PickerMixin>;
        timePicker: InstanceType<typeof PickerMixin>;
    };

    defaultTime = '00:00:00';
    defaultPace = '00:00';
    distance? = '';
    timeDisplay? = '';
    timeInput? = '';
    paceDisplay? = '';
    paceInput? = '';

    get distanceValue() {
        const distance = this.$store.getters['runningEvent/getEventById'](
            this.distance
        );

        if (!distance) {
            return;
        }

        return convert(distance.value)
            .from(distance.unit)
            .to(this.isMetricSystem ? 'km' : 'mi');
    }

    get paceSuffix() {
        this.calc();
        return this.isMetricSystem ? 'min/km' : 'min/mi';
    }

    onDistanceChange(value: string) {
        this.distance = value;

        if (!value) {
            if (!this.timeInput) {
                this.timeDisplay = this.defaultTime;
                this.timeInput = '';
            }

            if (!this.paceInput) {
                this.paceDisplay = this.defaultPace;
                this.paceInput = '';
            }

            return;
        }

        this.calc();
    }

    onTimeClear() {
        this.timeInput = '';
        this.paceInput = '';
        this.paceDisplay = this.defaultPace;
    }

    onPaceClear() {
        this.paceInput = '';
        this.timeInput = '';
        this.timeDisplay = this.defaultTime;
    }

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
    }

    calcPace(time: string) {
        this.$refs.pacePicker.clearInputValue();
        this.timeInput = time;
        this.paceInput = '';

        if (!this.distance || !time || time === this.defaultTime) {
            return;
        }

        const timeInMins = stringToMinutes(time);

        if (!timeInMins || !this.distanceValue) {
            return;
        }

        const pace = timeInMins / this.distanceValue;
        const duration = minsToDuration(pace);
        this.paceDisplay = duration || this.defaultPace;
    }

    calcTime(pace: string) {
        this.$refs.timePicker.clearInputValue();
        this.timeInput = '';
        this.paceInput = pace;

        if (!this.distance || !pace || pace === this.defaultPace) {
            return;
        }

        const paceInMins = stringToMinutes(pace);

        if (!paceInMins || !this.distanceValue) {
            return;
        }

        const time = paceInMins * this.distanceValue;
        const duration = minsToDuration(time);
        this.timeDisplay = duration || this.defaultTime;
    }
}
</script>
