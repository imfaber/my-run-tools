<template>
    <VCol :class="{ 'text-center': icon }" v-bind="{ ...$props, ...$attrs }">
        <h2 v-if="title" class="font-weight-regular mb-4 text-center">
            {{ title }}
        </h2>

        <VIcon v-if="icon" class="mt-md-12" large>{{ icon }}</VIcon>

        <slot />
    </VCol>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: null
        }
    }
};
</script>
