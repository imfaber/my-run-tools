<template>
    <ToolSection :title="title" :description="description">
        <ToolWidget cols="12" md="3" title="Metric pace">
            <TimePicker
                ref="metricPace"
                :display-value="metricPace"
                placeholder="Enter pace"
                display-value-suffix="min/km"
                @change="onMetricPaceChange"
                @clear="onClear"
            />
        </ToolWidget>

        <ToolWidget cols="12" md="3" title="Imperial pace">
            <TimePicker
                ref="imperialPace"
                :display-value="imperialPace"
                display-value-suffix="min/mi"
                placeholder="Enter pace"
                @change="onImperialPaceChange"
                @clear="onClear"
            />
        </ToolWidget>

        <ToolWidget cols="12" md="3" title="Metric speed">
            <NumberPicker
                ref="metricSpeed"
                :display-value="metricSpeed"
                display-value-suffix="km/h"
                placeholder="Enter speed"
                @change="onMetricSpeedChange"
                @clear="onClear"
            />
        </ToolWidget>

        <ToolWidget cols="12" md="3" title="Imperial speed">
            <NumberPicker
                ref="imperialSpeed"
                :display-value="imperialSpeed"
                display-value-suffix="mph"
                placeholder="Enter speed"
                @change="onImperialSpeedChange"
                @clear="onClear"
            />
        </ToolWidget>
    </ToolSection>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import convert from 'convert-units';
import TimePicker from '~/components/forms/form-controls/TimePicker.vue';
import NumberPicker from '~/components/forms/form-controls/NumberPicker.vue';
import ToolWidget from '~/components/ToolWidget.vue';
import ToolSection from '~/components/ToolSection.vue';
import { stringToMinutes, minsToDuration } from '~/utils/duration.ts';
import ToolMixin from '~/mixins/tool';
import PickerMixin from '~/mixins/picker';
import { unitLength, unitPace } from '~/utils/types';

@Component({
    components: {
        TimePicker,
        NumberPicker,
        ToolSection,
        ToolWidget
    }
})
export default class PaceTimeCalculator extends Mixins(ToolMixin) {
    $refs!: {
        imperialSpeed: InstanceType<typeof PickerMixin>;
        imperialPace: InstanceType<typeof PickerMixin>;
        metricSpeed: InstanceType<typeof PickerMixin>;
        metricPace: InstanceType<typeof PickerMixin>;
    };

    defaultPace = '00:00';
    defaultSpeed = 0;
    imperialSpeed? = 0;
    metricSpeed? = 0;
    imperialPace? = '';
    metricPace? = '';

    convertPace(value: string, from: unitPace, to: unitPace) {
        const timeInMins = stringToMinutes(value);

        if (!timeInMins) {
            return;
        }

        const convertedPaceMins = convert(timeInMins)
            .from(from)
            .to(to);
        return minsToDuration(convertedPaceMins);
    }

    convertSpeed(value: number, from: unitLength, to: unitLength): number {
        return parseFloat(
            convert(value)
                .from(from)
                .to(to)
                .toFixed(1)
        );
    }

    paceToSpeed(value: string): number | undefined {
        const mins = stringToMinutes(value);

        if (!mins) {
            return;
        }

        return parseFloat((60 / mins).toFixed(1));
    }

    speedToPace(value: number) {
        return minsToDuration(3600 / (60 * value));
    }

    onImperialPaceChange(value: string) {
        this.metricPace = this.convertPace(value, 'min/mi', 'min/km');
        this.metricSpeed = this.paceToSpeed(this.metricPace ?? '');
        this.imperialSpeed = this.paceToSpeed(value);
        this.$refs.imperialSpeed.clearInputValue();
        this.$refs.metricSpeed.clearInputValue();
        this.$refs.metricPace.clearInputValue();
    }

    onMetricPaceChange(value: string) {
        this.imperialPace = this.convertPace(value, 'min/km', 'min/mi');
        this.metricSpeed = this.paceToSpeed(value);
        this.imperialSpeed = this.paceToSpeed(this.imperialPace ?? '');
        this.$refs.imperialSpeed.clearInputValue();
        this.$refs.metricSpeed.clearInputValue();
        this.$refs.imperialPace.clearInputValue();
    }

    onMetricSpeedChange(value: number) {
        this.imperialSpeed = this.convertSpeed(value, 'km', 'mi');
        this.metricPace = this.speedToPace(value);
        this.imperialPace = this.speedToPace(this.imperialSpeed);
        this.$refs.imperialSpeed.clearInputValue();
        this.$refs.imperialPace.clearInputValue();
        this.$refs.metricPace.clearInputValue();
    }

    onImperialSpeedChange(value: number) {
        this.metricSpeed = this.convertSpeed(value, 'mi', 'km');
        this.imperialPace = this.speedToPace(value);
        this.metricPace = this.speedToPace(this.metricSpeed);
        this.$refs.metricSpeed.clearInputValue();
        this.$refs.imperialPace.clearInputValue();
        this.$refs.metricPace.clearInputValue();
    }

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

// export default {
//     components: {
//         TimePicker,
//         NumberPicker,
//         ToolSection,
//         ToolWidget
//     },

//     mixins: [ToolMixin],

//     data() {
//         return {
//             defaultPace: '00:00',
//             defaultSpeed: 0,
//             imperialSpeed: null,
//             metricSpeed: null,
//             imperialPace: null,
//             metricPace: null
//         };
//     },

//     methods: {
//         convertPace(value, from, to) {
//             const timeInMins = stringToMinutes(value);

//             const convertedPaceMins = convert(timeInMins)
//                 .from(from)
//                 .to(to);
//             return minsToDuration(convertedPaceMins);
//         },

//         convertSpeed(value, from, to) {
//             return convert(value)
//                 .from(from)
//                 .to(to)
//                 .toFixed(1);
//         },

//         paceToSpeed(value) {
//             return (60 / stringToMinutes(value)).toFixed(1);
//         },

//         speedToPace(value) {
//             return minsToDuration(3600 / (60 * value));
//         },

//         onImperialPaceChange(value) {
//             this.metricPace = this.convertPace(value, 'min/mi', 'min/km');
//             this.metricSpeed = this.paceToSpeed(this.metricPace);
//             this.imperialSpeed = this.paceToSpeed(value);
//             this.$refs.imperialSpeed.clearInputValue();
//             this.$refs.metricSpeed.clearInputValue();
//             this.$refs.metricPace.clearInputValue();
//         },

//         onMetricPaceChange(value) {
//             this.imperialPace = this.convertPace(value, 'min/km', 'min/mi');
//             this.metricSpeed = this.paceToSpeed(value);
//             this.imperialSpeed = this.paceToSpeed(this.imperialPace);
//             this.$refs.imperialSpeed.clearInputValue();
//             this.$refs.metricSpeed.clearInputValue();
//             this.$refs.imperialPace.clearInputValue();
//         },

//         onMetricSpeedChange(value) {
//             this.imperialSpeed = this.convertSpeed(value, 'km', 'mi');
//             this.metricPace = this.speedToPace(value);
//             this.imperialPace = this.speedToPace(this.imperialSpeed);
//             this.$refs.imperialSpeed.clearInputValue();
//             this.$refs.imperialPace.clearInputValue();
//             this.$refs.metricPace.clearInputValue();
//         },

//         onImperialSpeedChange(value) {
//             this.metricSpeed = this.convertSpeed(value, 'mi', 'km');
//             this.imperialPace = this.speedToPace(value);
//             this.metricPace = this.speedToPace(this.metricSpeed);
//             this.$refs.metricSpeed.clearInputValue();
//             this.$refs.imperialPace.clearInputValue();
//             this.$refs.metricPace.clearInputValue();
//         },

//         onClear() {
//             this.$refs.imperialSpeed.clearInputValue();
//             this.$refs.metricSpeed.clearInputValue();
//             this.$refs.imperialPace.clearInputValue();
//             this.$refs.metricPace.clearInputValue();
//             this.imperialSpeed = this.defaultSpeed;
//             this.metricSpeed = this.defaultSpeed;
//             this.imperialPace = this.defaultPace;
//             this.metricPace = this.defaultPace;
//         }
//     }
// };
</script>
