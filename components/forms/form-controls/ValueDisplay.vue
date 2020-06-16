<template>
    <div class="value-display text-center" @click="onClick">
        <div class="value-display__value">
            {{ value }} <small v-if="suffix">{{ suffix }}</small>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        suffix: {
            type: String,
            default: ''
        }
    },

    methods: {
        onClick() {
            this.$emit('click');
        }
    }
};
</script>

<style lang="scss" scoped>
.value-display {
    padding: 16px;
    color: white;
    background: var(--v-primary-base);
    border-radius: 0 0 16px 16px;
    cursor: pointer;

    .value-display__value {
        font-size: 40px;
        height: 40px;
        line-height: 40px;
    }

    small {
        font-size: 50%;
    }
}
</style>
