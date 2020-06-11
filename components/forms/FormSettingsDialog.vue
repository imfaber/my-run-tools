<template>
    <v-dialog v-bind="{ ...$props, ...$attrs }">
        <v-card>
            <v-form ref="form" v-model="valid">
                <v-card-title>
                    <span class="headline">Settings</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <div>
                        <v-radio-group v-model="unitSystem">
                            <template v-slot:label>
                                <div>
                                    Your unit system
                                </div>
                            </template>
                            <v-radio :value="metricSystem">
                                <template v-slot:label>
                                    <div>
                                        Metric
                                    </div>
                                </template>
                            </v-radio>
                            <v-radio :value="imperialSystem">
                                <template v-slot:label>
                                    <div>
                                        Imperial
                                    </div>
                                </template>
                            </v-radio>
                        </v-radio-group>
                    </div>
                    <div>
                        <v-switch
                            v-model="compactNavPanel"
                            label="Compact navigation panel"
                        ></v-switch>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        fab
                        dark
                        small
                        color="primary"
                        @click="$emit('close')"
                    >
                        <v-icon dark>mdi-check</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { UNIT_SYSTEM_METRIC, UNIT_SYSTEM_IMPERIAL } from '~/utils/unit-system';

export default {
    data() {
        return {
            valid: false,
            settings: this.$store.state.settings,
            metricSystem: UNIT_SYSTEM_METRIC,
            imperialSystem: UNIT_SYSTEM_IMPERIAL,
        };
    },
    computed: {
        unitSystem: {
            get() {
                return this.settings.unitSystem;
            },
            set(value) {
                this.$store.dispatch('settings/set', { unitSystem: value });
            }
        },
        darkTheme: {
            get() {
                return this.settings.darkTheme;
            },
            set(value) {
                this.$store.dispatch('settings/set', { darkTheme: value });
            }
        },
        compactNavPanel: {
            get() {
                return this.settings.compactNavPanel;
            },
            set(value) {
                this.$store.dispatch('settings/set', {
                    compactNavPanel: value
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep {
}
</style>
