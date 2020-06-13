<template>
    <v-app v-show="ready" id="run-tools" light>
        <v-navigation-drawer
            v-model="drawer"
            :mini-variant="$store.state.settings.compactNavPanel"
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

            <v-divider></v-divider>

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
                <v-divider></v-divider>

                <v-list-item link @click="settingsDialog = true">
                    <v-list-item-action>
                        <v-icon color="white">mdi-cog</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text"
                            >Settings</v-list-item-title
                        >
                    </v-list-item-content>
                </v-list-item>

                <form-settings-dialog
                    v-model="settingsDialog"
                    persistent
                    max-width="350px"
                    @close="closeSettingsDialog"
                ></form-settings-dialog>
            </template>
        </v-navigation-drawer>

        <v-app-bar :clipped-left="true" app :dense="isSmallScreen">
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
            <v-container class="main-container py-12" fluid>
                <!-- <div class="jump-to d-flex justify-center">
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
                </div> -->
                <nuxt />
            </v-container>
        </v-content>

        <div class="text-center">
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </div>
    </v-app>
</template>

<script>
import FormSettingsDialog from '~/components/forms/FormSettingsDialog';

export default {
    components: { FormSettingsDialog },
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
            ready: false,
            settingsDialog: false
        };
    },
    computed: {
        isSmallScreen() {
            return this.$vuetify.breakpoint.mdAndDown;
        }
    },
    beforeCreate() {
        setTimeout(() => {
            this.$vuetify.theme.dark = this.$store.state.settings.darkTheme;
            this.ready = true;
        });
    },
    methods: {
        closeSettingsDialog() {
            this.settingsDialog = false;
        }
    }
};
</script>

<style lang="scss">
.navbar-link {
    text-decoration: none;
}

.main-container {
    align-items: center;
    display: flex;
}

.jump-to {
    max-width: 600px;
    margin: 1em auto;
}

.v-text-field {
    position: relative;
    z-index: 1;
}

div.v-autocomplete__content.v-menu__content {
    transform: translateY(-5px);
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 5px 5px 0px rgba(0, 0, 0, 0.12);
    border-radius: 0 0 16px 16px;

    .v-list {
        border-radius: 0;
    }
}

header.v-app-bar.v-app-bar--fixed {
    z-index: 1;
}
</style>
