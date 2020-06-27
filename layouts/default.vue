<template>
    <VApp v-show="ready" id="run-tools" light>
        <VNavigationDrawer
            v-model="drawer"
            :mini-variant="$store.state.settings.compactNavPanel"
            :clipped="true"
            app
        >
            <VList class="pt-0 pb-0">
                <VListItem
                    v-if="isSmallScreen"
                    link
                    @click.stop="drawer = false"
                >
                    <VListItemAction>
                        <VIcon color="white">mdi-close</VIcon>
                    </VListItemAction>
                    <VListItemContent>
                        <VListItemTitle class="white--text">
                            Close
                        </VListItemTitle>
                    </VListItemContent>
                </VListItem>
            </VList>

            <VDivider />

            <VList class="pt-0 pb-0">
                <VListItem
                    v-for="(item, i) in navItems"
                    :key="i"
                    :to="item.to"
                    router
                >
                    <VListItemAction>
                        <VIcon color="white">{{ item.icon }}</VIcon>
                    </VListItemAction>
                    <VListItemContent>
                        <VListItemTitle
                            class="white--text"
                            v-text="item.title"
                        />
                    </VListItemContent>
                </VListItem>
            </VList>

            <template v-slot:append>
                <VDivider />

                <VListItem link @click="settingsDialog = true">
                    <VListItemAction>
                        <VIcon color="white">mdi-cog</VIcon>
                    </VListItemAction>
                    <VListItemContent>
                        <VListItemTitle class="white--text"
                            >Settings</VListItemTitle
                        >
                    </VListItemContent>
                </VListItem>
<!--
                <FormSettingsDialog
                    v-model="settingsDialog"
                    persistent
                    max-width="350px"
                    @close="closeSettingsDialog"
                /> -->
            </template>
        </VNavigationDrawer>

        <VAppBar :clipped-left="true" app :dense="isSmallScreen">
            <VAppBarNavIcon color="white" @click.stop="drawer = !drawer" />

            <VToolbarTitle class="align-center">
                <NLink to="/" class="title white--text navbar-link">
                    MyRun<span class="font-weight-light">Tools</span>
                </NLink>
            </VToolbarTitle>

            <VSpacer />

            <a
                href="https://github.com/imfaber/my-run-tools"
                target="_blank"
                class="navbar-link"
            >
                <VIcon color="white" large>mdi-github</VIcon>
            </a>
        </VAppBar>

        <VContent>
            <VContainer class="main-container py-12" fluid>
                <Nuxt />
            </VContainer>

            <div class="text-center copy">
                <small
                    >&copy; {{ new Date().getFullYear() }} - Made with ❤ by
                    Fabrizio Meinero -
                    <a href="https://imfaber.me/" target="_blank"
                        >Imfaber</a
                    ></small
                >
            </div>
        </VContent>
    </VApp>
</template>

<script>
// import FormSettingsDialog from '~/components/forms/FormSettingsDialog';
import tools from '~/data/tools.ts';

export default {
    // components: { FormSettingsDialog },
    data() {
        return {
            drawer: !this.$vuetify.breakpoint.mdAndDown,
            navItems: [
                {
                    icon: 'mdi-run-fast',
                    title: 'Tools',
                    to: '/tools'
                },
                {
                    icon: 'mdi-information',
                    title: 'About',
                    to: '/about'
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
    mounted() {
        const toolItems = this.$router.options.routes
            .find((x) => x.name === 'tools')
            .children.map((r) => ({
                title: tools.find((t) => r.name === t.id).title,
                routeName: r.name,
                order: tools.findIndex((t) => r.name === t.id)
            }));

        setTimeout(() => {
            this.$store.commit(
                'tool/setList',
                toolItems.sort((a, b) => (a.weight > b.weight ? 1 : -1))
            );
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

.jump-to {
    max-width: 600px;
    margin: 1em auto;
}

.v-text-field {
    position: relative;
    z-index: 1;
}

div.v-autocomplete__content.v-menu__content {
    margin-top: -7px;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 5px 5px 0px rgba(0, 0, 0, 0.12);
    border-radius: 0 0 25px 25px;
    padding-top: 7px;
    background: white;

    .v-list {
        border-radius: 0;
        padding: 0;

        .v-list-item__content {
            padding-left: 8px;
            padding-right: 8px;
        }
    }
}

header.v-app-bar.v-app-bar--fixed {
    z-index: 10;
}

.v-select--is-menu-active {
    z-index: 5;
}

.v-input__append-inner {
    margin-left: 5px !important;
}

.copy {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
}
</style>
