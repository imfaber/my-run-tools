<template>
    <v-layout>
        <v-row class="text-center">
            <time-picker></time-picker>
        </v-row>

        <v-row class="text-center">
            <distance-picker></distance-picker>
        </v-row>
    </v-layout>
</template>

<script>
import TimePicker from '~/components/forms/form-controls/TimePicker';
import DistancePicker from '~/components/forms/form-controls/DistancePicker';

export default {
    components: {
        TimePicker,
        DistancePicker
    }
};
</script>
