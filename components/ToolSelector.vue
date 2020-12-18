<template>
    <VAutocomplete
        v-if="autocomplete && !this.$vuetify.breakpoint.xs"
        class="tool-selector"
        :items="tools"
        attach
        eager
        hide-details
        label="Go to tool"
        placeholder="Go to tool"
        cache-items
        single-line
        item-text="title"
        item-value="routeName"
        no-data-text="No tool found"
        solo
        rounded
        :value="value"
        @change="choose"
    />
    <VSelect
        v-else-if="autocomplete && this.$vuetify.breakpoint.xs"
        class="tool-selector"
        :items="tools"
        attach
        eager
        hide-details
        label="Go to tool"
        cache-items
        single-line
        item-text="title"
        item-value="routeName"
        solo
        rounded
        :menu-props="{ 'open-delay': 0, transition: false }"
        :value="value"
        @change="choose"
    />
    <VCard v-else class="mx-auto nav" rounded shaped>
        <VList>
            <VListItemGroup color="primary">
                <VListItem
                    v-for="(item, i) in tools"
                    :key="i"
                    :to="{ name: item.routeName }"
                    nuxt
                    router
                >
                    <VListItemContent>
                        <VListItemTitle
                            class="text-center"
                            v-text="item.title"
                        />
                    </VListItemContent>
                </VListItem>
            </VListItemGroup>
        </VList>
    </VCard>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class YourComponent extends Vue {
    @Prop({ default: true }) readonly autocomplete!: boolean;

    get tools() {
        return this.$toolStore.list;
    }

    get value() {
        return this.tools.find((x) => x.id === this.$route.name);
    }

    choose(routeName: string) {
        this.$router.push({ name: routeName });
    }
}
</script>

<style lang="scss" scoped>
.v-text-field--rounded {
    border-radius: 25px;

    &.v-select--is-menu-active {
        border-radius: 25px 25px 0 0;
    }
}

.nav {
    border-radius: 25px;
    overflow: hidden;

    .v-list {
        padding: 0;
    }
}

::v-deep {
    .v-autocomplete__content.v-menu__content,
    .v-menu__content {
        margin-top: -7px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
            0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 5px 5px 0px rgba(0, 0, 0, 0.12);
        border-radius: 0 0 25px 25px;
        padding-top: 7px;
        background: white;
        top: 100% !important;

        .v-list {
            border-radius: 0;
            padding: 0;

            .v-list-item__content {
                padding-left: 8px;
                padding-right: 8px;
            }
        }
    }
}
</style>
