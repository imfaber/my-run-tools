<template>
    <v-dialog v-bind="{ ...$props, ...$attrs }">
        <v-card>
            <v-form ref="form" v-model="valid">
                <v-card-title>
                    <span class="headline">{{ title }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-text-field
                                v-model="localDistance.name"
                                label="Distance name"
                                placeholder="E.g. My long run"
                                validate-on-blur
                                :rules="nameRules"
                                autocomplete="off"
                                class="mb-4"
                            ></v-text-field>
                            <v-text-field
                                v-model="localDistance.value"
                                label="Distance"
                                required
                                placeholder="Enter distance and unit"
                                class="distance-field"
                                type="number"
                                validate-on-blur
                                :rules="distanceRules"
                                autocomplete="off"
                            >
                                <template v-slot:append>
                                    <v-select
                                        v-model="localDistance.unit"
                                        :items="unitsList"
                                        solo
                                        flat
                                        dense
                                        hide-details
                                        class="mt-0"
                                        :rules="[
                                            (v) =>
                                                !!unitsList.find(
                                                    (x) => x.value === v
                                                ) || 'Unit is required'
                                        ]"
                                    ></v-select>
                                </template>
                            </v-text-field>

                            <v-alert v-if="error" dense type="error">
                                <!-- eslint-disable-next-line vue/no-v-html -->
                                <span v-html="error"></span>
                            </v-alert>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pr-6 pl-6 pt-4 pb-4">
                    <v-btn color="blue darken-1" text @click="$emit('close')"
                        >Cancel</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="onSave">Save</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { getUnits, UNIT_SYSTEM_MEASURE_LENGTH } from '~/utils/unit-system';

const distanceDefault = {
    isCustom: false,
    name: null,
    value: null,
    unit: null
};

export default {
    props: {
        distance: {
            type: Object,
            default: distanceDefault
        },
        distancesList: {
            type: Array,
            required: true
        }
    },
    data() {
        const unitsList = getUnits(
            UNIT_SYSTEM_MEASURE_LENGTH,
            this.$store.state.settings.unitSystem
        ).map((x) => ({
            text: x.plural,
            value: x.abbr
        }));

        return {
            valid: false,
            error: null,
            unitsList,
            localDistance: {
                ...distanceDefault,
                unit: unitsList[0].value,
                ...this.distance
            },
            nameRules: [
                (v) => !!v || 'Distance name is required',
                (v) =>
                    !this.distancesList.find(
                        (x) => x.name === v && x.id !== this.localDistance.id
                    ) || 'This name is already taken',
                (v) =>
                    (v && v.length > 1) ||
                    'Distance name must be more than 1 character'
            ],
            distanceRules: [
                (v) => !!v || 'Distance is required',
                (v) =>
                    (v && parseInt(v) > 0) || 'Distance must be greater than 0'
            ]
        };
    },

    computed: {
        isEdit() {
            return this.localDistance.isCustom;
        },
        title() {
            const action = this.isEdit ? 'Edit' : 'Add';
            return `${action} custom distance`;
        }
    },

    methods: {
        async onSave() {
            this.$refs.form.validate();

            if (!this.valid) {
                return;
            }

            const action = this.isEdit
                ? 'runningEvent/editEvent'
                : 'runningEvent/addEvent';

            const distance = await this.$store.dispatch(
                action,
                this.localDistance
            );

            this.$emit('close', { isEdit: this.isEdit, distance });
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep {
    .distance-field.v-text-field
        > .v-input__control
        > .v-input__slot
        > .v-text-field__slot {
        flex: 0 0 auto;
    }

    .v-text-field .v-input__append-inner {
        margin-top: 0;
    }

    .v-text-field--solo > .v-input__control > .v-input__slot {
        background: transparent;
    }

    .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
        > .v-input__control
        > .v-input__slot,
    .v-text-field.v-text-field--enclosed .v-text-field__details {
        padding: 0 0 0 12px;
    }
}
</style>
