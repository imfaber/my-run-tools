<template>
    <ToolSection :title="title" :description="description">
        <ToolWidget
            v-for="(item, i) in widgets"
            :key="i"
            cols="12"
            md="3"
            :title="item.title"
        >
            <NumberPicker
                :ref="item.widgetRef.toString()"
                :display-value="item.value"
                :display-value-suffix="item.suffix"
                :placeholder="item.placeholder"
                :max="item.max"
                @change="convertDistances($event, item.widgetRef)"
                @clear="clear"
            />
        </ToolWidget>
    </ToolSection>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import TimePicker from '~/components/forms/form-controls/TimePicker.vue';
import NumberPicker from '~/components/forms/form-controls/NumberPicker.vue';
import ToolWidget from '~/components/ToolWidget.vue';
import ToolSection from '~/components/ToolSection.vue';
import ToolMixin from '~/mixins/tool';
import { convertLength } from '~/utils/unit-system';

export enum WidgetRef {
    Meters = 'meters',
    Kilometers = 'kilometers',
    Yards = 'yards',
    Miles = 'miles'
}

interface Widget {
    widgetRef: WidgetRef;
    title: string;
    suffix: string;
    placeholder: string;
    value: number;
    max: number;
}

@Component({
    components: {
        TimePicker,
        NumberPicker,
        ToolSection,
        ToolWidget
    }
})
export default class PaceTimeCalculator extends Mixins(ToolMixin) {
    widgets = [
        {
            widgetRef: WidgetRef.Meters,
            title: 'Meters',
            suffix: 'm',
            placeholder: 'Enter meters',
            value: 0,
            max: 10000
        },
        {
            widgetRef: WidgetRef.Kilometers,
            title: 'Kilometers',
            suffix: 'km',
            placeholder: 'Enter kilometers',
            value: 0,
            max: 200
        },
        {
            widgetRef: WidgetRef.Yards,
            title: 'Yards',
            suffix: 'yd',
            placeholder: 'Enter yards',
            value: 0,
            max: 10000
        },
        {
            widgetRef: WidgetRef.Miles,
            title: 'Miles',
            suffix: 'mi',
            placeholder: 'Enter miles',
            value: 0,
            max: 100
        }
    ] as Array<Widget>;

    getWidgetIndex(widgetRef: WidgetRef): number {
        return this.widgets.findIndex((w) => w.widgetRef === widgetRef);
    }

    clear() {
        this.widgets.forEach((w) => {
            (this.$refs as any)[w.widgetRef][0].clearInputValue();
            w.value = 0;
        });
    }

    convertDistances(value: number, widgetRef: WidgetRef) {
        const mIndex = this.getWidgetIndex(WidgetRef.Meters);
        const kmIndex = this.getWidgetIndex(WidgetRef.Kilometers);
        const ydIndex = this.getWidgetIndex(WidgetRef.Yards);
        const miIndex = this.getWidgetIndex(WidgetRef.Miles);

        switch (widgetRef) {
            case WidgetRef.Meters: {
                this.widgets[mIndex].value = value;
                this.widgets[kmIndex].value = convertLength(value, 'm', 'km');
                this.widgets[ydIndex].value = convertLength(value, 'm', 'yd');
                this.widgets[miIndex].value = convertLength(value, 'm', 'mi');

                break;
            }
            case WidgetRef.Kilometers: {
                this.widgets[mIndex].value = convertLength(value, 'km', 'm');
                this.widgets[kmIndex].value = value;
                this.widgets[ydIndex].value = convertLength(value, 'km', 'yd');
                this.widgets[miIndex].value = convertLength(value, 'km', 'mi');

                break;
            }
            case WidgetRef.Yards: {
                this.widgets[mIndex].value = convertLength(value, 'yd', 'm');
                this.widgets[kmIndex].value = convertLength(value, 'yd', 'km');
                this.widgets[ydIndex].value = value;
                this.widgets[miIndex].value = convertLength(value, 'yd', 'mi');

                break;
            }
            case WidgetRef.Miles: {
                this.widgets[mIndex].value = convertLength(value, 'mi', 'm');
                this.widgets[kmIndex].value = convertLength(value, 'mi', 'km');
                this.widgets[ydIndex].value = convertLength(value, 'mi', 'yd');
                this.widgets[miIndex].value = value;

                break;
            }
        }

        this.widgets.forEach((w) => {
            if (w.widgetRef !== widgetRef) {
                (this.$refs as any)[w.widgetRef][0].clearInputValue();
            }
        });
    }
}
</script>
