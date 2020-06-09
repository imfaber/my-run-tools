<template>
    <v-app id="run-tools" dark>
        <v-navigation-drawer
            v-model="drawer"
            :mini-variant="miniVariant"
            :clipped="true"
            app
        >
            <v-list class="pt-0 pb-0">
                <v-list-item
                    v-if="isSmallScreen"
                    link
                    @click.stop="drawer = false"
                >
                    <v-list-item-action>
                        <v-icon color="white">mdi-close</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">
                            Close
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-list class="pt-0 pb-0">
                <v-list-item
                    v-for="(item, i) in navItems"
                    :key="i"
                    :to="item.to"
                    router
                    exact
                >
                    <v-list-item-action>
                        <v-icon color="white">{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title
                            class="white--text"
                            v-text="item.title"
                        />
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <template v-slot:append>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon color="white">mdi-cog</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text"
                            >Settings</v-list-item-title
                        >
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item link @click.stop="miniVariant = !miniVariant">
                    <v-list-item-action>
                        <v-icon color="white"
                            >mdi-{{
                                `chevron-${miniVariant ? 'right' : 'left'}`
                            }}</v-icon
                        >
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text"
                            >Minify</v-list-item-title
                        >
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-navigation-drawer>

        <v-app-bar :clipped-left="true" fixed app :dense="isSmallScreen">
            <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" />
            <v-toolbar-title class="align-center">
                <n-link to="/" class="title white--text navbar-link">
                    Run <span class="font-weight-light">Tools</span>
                </n-link>
            </v-toolbar-title>

            <v-spacer />

            <a
                href="https://github.com/imfaber/run-tools"
                target="_blank"
                class="navbar-link"
            >
                <v-icon color="white" large>mdi-github</v-icon>
            </a>
        </v-app-bar>

        <v-content>
            <v-container>
                <div class="jump-to d-flex justify-center">
                    <v-autocomplete
                        :items="toolItems"
                        hide-details
                        label="Go to tool"
                        class="hidden-sm-and-down lighten-4"
                        clearable
                        cache-items
                        single-line
                        color="blue-grey lighten-2"
                        solo
                    />
                </div>
                <nuxt />
            </v-container>
        </v-content>

        <div class="text-center">
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </div>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            drawer: !this.$vuetify.breakpoint.mdAndDown,
            navItems: [
                {
                    icon: 'mdi-run-fast',
                    title: 'Tools',
                    to: '/'
                },
                {
                    icon: 'mdi-information',
                    title: 'About',
                    to: '/inspire'
                }
            ],
            toolItems: [
                {
                    text: 'Pace/Time calculator',
                    value: '/pace-time-calculator'
                },
                {
                    text: 'Other tool',
                    value: '/pace-time-calculator'
                }
            ],
            miniVariant: false
        };
    },
    computed: {
        isSmallScreen() {
            return this.$vuetify.breakpoint.mdAndDown;
        }
    },
    created() {
        this.$vuetify.theme.dark = false;
    }
};
</script>

<style lang="scss">
.navbar-link {
    text-decoration: none;
}

.jump-to {
    max-width: 600px;
    margin: 1em auto;
}
</style>
