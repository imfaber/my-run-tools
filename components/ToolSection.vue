<template>
    <VRow align="center" justify="center" v-bind="{ ...$props, ...$attrs }">
        <VCol cols="12" class="text-center mb-8">
            <h1 class="font-weight-regular">{{ title }}</h1>

            <div v-if="description" class="font-weight-light title">
                {{ description }}
            </div>
        </VCol>
        <slot />
    </VRow>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ToolSection extends Vue {
    @Prop(String) readonly title: string | undefined;
    @Prop(String) readonly description: string | undefined;
}
</script>
