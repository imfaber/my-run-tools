<template>
    <VCol :class="{ 'text-center': icon }" v-bind="{ ...$props, ...$attrs }">
        <h2 v-if="title" class="font-weight-regular mb-4 text-center">
            {{ title }}
        </h2>

        <VIcon v-if="icon" class="mt-md-12" large>{{ icon }}</VIcon>

        <slot />
    </VCol>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ToolWidget extends Vue {
    @Prop(String) readonly title: string | undefined;
    @Prop(String) readonly icon: string | undefined;
}
</script>
