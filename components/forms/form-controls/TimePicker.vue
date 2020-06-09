<template>
    <div v-on-clickaway="onClickAway">
        <v-text-field
            v-model="time"
            filled
            :clear-icon="timeDefault !== time ? 'mdi-close-circle' : ''"
            clearable
            :label="label"
            type="text"
            @click:clear.stop.prevent="onClear"
            @input="onInput"
            @focus="isPickerActive = true"
        ></v-text-field>

        <v-time-picker
            v-if="isPickerActive"
            v-model="pickerTime"
            use-seconds
            scrollable
            full-width
            format="24hr"
            @input="onPickerInput"
        ></v-time-picker>
    </div>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'

export default {
    directives: {
        onClickaway
    },

    props: {
        label: {
            type: String,
            default: 'Time'
        }
    },

    data() {
        return {
            time: null,
            timeDefault: '00:00:00',
            pickerTime: null,
            isPickerActive: false
        }
    },

    created() {
        this.onClear()
    },

    methods: {
        isValidTimeFormat() {
            console.log(
                /^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/.test(this.time)
            )
            return /^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/.test(this.time)
        },
        onInput(value) {
            if (this.isValidTimeFormat()) {
                this.pickerTime = this.time
            }
            console.log('dd', value)
        },
        onPickerInput(value) {
            console.log('www', value)
            this.time = this.pickerTime
        },
        async onClear() {
            await this.$nextTick()
            this.time = null
            this.pickerTime = this.timeDefault
        },
        onClickAway() {
            this.isPickerActive = false
        }
    }
}
</script>

<style lang="scss">
.v-picker__title__btn {
    display: none;
}

.v-time-picker-title {
    justify-content: center;
}
</style>
