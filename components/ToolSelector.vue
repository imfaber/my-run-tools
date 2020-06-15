<template>
    <v-autocomplete
        v-if="autocomplete"
        class="tool-selector"
        :items="tools"
        hide-details
        label="Go to tool"
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
    <v-card v-else class="mx-auto nav" rounded shaped>
        <v-list>
            <v-list-item-group color="primary">
                <v-list-item
                    v-for="(item, i) in tools"
                    :key="i"
                    :to="{ name: item.routeName }"
                    nuxt
                    router
                >
                    <v-list-item-content>
                        <v-list-item-title
                            class="text-center"
                            v-text="item.title"
                        ></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>

<script>
export default {
    props: {
        autocomplete: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            toolItems: null
        };
    },

    computed: {
        tools() {
            return this.$store.state.tool.list;
        },

        value() {
            return this.tools.find((x) => x.routeName === this.$route.name);
        }
    },

    methods: {
        choose(routeName) {
            this.$router.push({ name: routeName });
        }
    }
};
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
</style>
