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

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';
import StoreAccessorMixin from '~/mixins/store-accessor';
import { UnitSystem, SettingsOptions } from '~/utils/types.ts';

@Component
export default class FormSettingsDialog extends Mixins(StoreAccessorMixin) {
    valid = false;
    metricSystem = UnitSystem.Metric;
    imperialSystem = UnitSystem.Imperial;

    get unitSystem() {
        return this.settingsStore.unitSystem;
    }

    set unitSystem(value: UnitSystem) {
        this.settingsStore.update({ unitSystem: value } as SettingsOptions);
    }

    get darkTheme() {
        return this.settingsStore.darkTheme;
    }

    set darkTheme(value: boolean) {
        this.settingsStore.update({ darkTheme: value } as SettingsOptions);
    }

    get compactNavPanel() {
        return this.settingsStore.compactNavPanel;
    }

    set compactNavPanel(value: boolean) {
        this.settingsStore.update({
            compactNavPanel: value
        } as SettingsOptions);
    }
}
</script>
