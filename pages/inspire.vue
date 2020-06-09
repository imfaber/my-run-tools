<template>
    <v-layout>
        <v-flex class="text-center">
            <time-picker></time-picker>
        </v-flex>
    </v-layout>
</template>

<script>
import TimePicker from '~/components/forms/form-controls/TimePicker'

export default {
    components: {
        TimePicker
    }
}
</script>
