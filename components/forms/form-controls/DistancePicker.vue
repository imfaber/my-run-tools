<template>
    <div class="distance-picker">
        <v-autocomplete
            ref="inputField"
            v-model="distance"
            :items="distancesList"
            placeholder="Select distance"
            item-value="id"
            item-text="name"
            no-data-text="Distance not available"
            :search-input.sync="searchInput"
            attach
            shaped
            solo
            eager
            clearable
            :readonly="!canEdit"
            :append-icon="keyboardIcon"
            @click:append.stop.prevent="isReadOnly = !isReadOnly"
            @keyup.native.enter="onEnter"
            @change="onChange"
        >
            <template v-slot:prepend-item>
                <v-list-item-content class="pt-0 pb-0">
                    <v-list-item-title>
                        <v-btn
                            class="ma-2"
                            text
                            small
                            color="primary"
                            @click="openCustomDistanceDialog"
                        >
                            <v-icon left>mdi-plus</v-icon> Add custom distance
                        </v-btn>
                    </v-list-item-title>
                </v-list-item-content>
            </template>

            <template v-slot:item="{ item }">
                <v-list-item-content>
                    <v-list-item-title>
                        {{ item.name }}
                    </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="item.isCustom">
                    <div class="d-flex">
                        <v-btn
                            icon
                            small
                            color="primary"
                            @click.stop.prevent="editDistance(item)"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                            icon
                            small
                            color="red"
                            @click.stop.prevent="
                                confirmDeletion = true;
                                distanceToDelete = item.id;
                                closeAutocompleteMenu();
                            "
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </v-list-item-action>
            </template>
        </v-autocomplete>

        <value-display
            :value="distanceDisplay"
            @click="openMenu"
        ></value-display>

        <form-custom-distance-dialog
            v-if="customDistanceDialog"
            v-model="customDistanceDialog"
            persistent
            max-width="350px"
            :distance="distanceToEdit"
            :distances-list="distancesList"
            @close="closeCustomDistanceDialog"
        ></form-custom-distance-dialog>

        <v-dialog
            v-if="confirmDeletion"
            v-model="confirmDeletion"
            max-width="310"
        >
            <v-card>
                <v-card-title class="headline">
                    Delete custom distance
                </v-card-title>

                <v-card-text>
                    You are about to delete
                    <strong class="red--text">
                        {{ getDistanceById(distanceToDelete).name }}
                    </strong>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="grey"
                        text
                        @click="
                            confirmDeletion = false;
                            distanceToDelete = null;
                        "
                    >
                        cancel
                    </v-btn>

                    <v-btn color="red" dark @click="deleteDistance()">
                        <v-icon left small>mdi-delete</v-icon>
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar
            v-model="snackbar"
            :timeout="3000"
            :color="snackbarColor"
            light
        >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="snackbarText"></span>
            <v-btn icon fab x-small dark @click="snackbar = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
import parseUnit from 'parse-unit';
import FormCustomDistanceDialog from '../FormCustomDistanceDialog';
import ValueDisplay from './ValueDisplay';
import { UNIT_SYSTEM_MEASURE_LENGTH, isValidUnit } from '~/utils/unit-system';

export default {
    components: { ValueDisplay, FormCustomDistanceDialog },

    props: {
        value: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            distance: '',
            searchInput: '',
            customDistanceDialog: false,
            confirmDeletion: null,
            distanceToEdit: null,
            distanceToDelete: null,
            snackbar: false,
            snackbarText: null,
            snackbarColor: null,
            isReadOnly: this.$vuetify.breakpoint.xs,
            isPickerActive: false,
            inputElement: null
        };
    },

    computed: {
        ...mapState({
            settingUnitSystem: (state) => state.settings.unitSystem,
            distancesList: (state) => state.runningEvent.events
        }),

        ...mapGetters('runningEvent', {
            getDistanceById: 'getEventById'
        }),

        distanceDisplay() {
            const distance = this.getDistanceById(this.distance);

            if (distance) {
                return `${distance.value} ${distance.unit}`;
            }

            return '...';
        },

        keyboardIcon() {
            if (this.$vuetify.breakpoint.xs && this.isPickerActive) {
                return this.canEdit ? 'mdi-keyboard-close' : 'mdi-keyboard';
            }
            return '';
        },

        canEdit() {
            if (!this.isPickerActive) {
                return true;
            }

            return !this.$vuetify.breakpoint.xs || !this.isReadOnly;
        }
    },

    watch: {
        value(value) {
            this.distance = value;
        }
    },

    mounted() {
        this.inputElement = this.$refs.inputField.$el.querySelector('input');

        this.$watch('$refs.inputField.$refs.menu.isActive', (value) => {
            this.isPickerActive = value;

            if (!value) {
                this.isReadOnly = true;
                this.inputElement.blur();
            }
        });
    },

    methods: {
        ...mapMutations({
            setCustomDistanceValues: 'form/setCustomDistanceValues'
        }),

        openCustomDistanceDialog() {
            if (!this.distanceToEdit) {
                const parsedDistance = this.parseDistanceString(
                    this.searchInput
                );

                this.distanceToEdit = {
                    name: this.searchInput,
                    ...parsedDistance
                };
            }

            this.customDistanceDialog = true;
            this.$refs.inputField.$refs.menu.isActive = false;
        },

        openMenu() {
            setTimeout(() => {
                this.$refs.inputField.$refs.menu.isActive = true;
            });
        },

        parseDistanceString(distance) {
            const parsed = parseUnit(distance);
            const value = parsed[0];

            if (parsed[1] === 'k') parsed[1] = 'km';

            const unit = isValidUnit(UNIT_SYSTEM_MEASURE_LENGTH, parsed[1])
                ? parsed[1]
                : null;

            return { value, unit };
        },

        closeCustomDistanceDialog(data) {
            this.customDistanceDialog = false;
            this.distanceToEdit = null;

            // Make sure the widget gets updated
            if (data) {
                const { isEdit, distance } = data;
                this.distance = null;
                setTimeout(() => {
                    this.distance = distance.id;
                });

                this.showSuccessSnackBar(
                    `Distance <strong>${distance.name}</strong> has been ${
                        isEdit ? 'updated' : 'added'
                    }!`
                );

                this.onChange();
            }
        },

        onChange() {
            setTimeout(() => {
                this.$emit('change', this.distance);
            });
        },

        editDistance(distance) {
            this.distanceToEdit = { ...distance };
            this.openCustomDistanceDialog();
        },

        deleteDistance() {
            if (this.confirmDeletion === this.distance) {
                this.distance = null;
            }

            const { name } = this.getDistanceById(this.distanceToDelete);

            this.$store.dispatch(
                'runningEvent/deleteEvent',
                this.distanceToDelete
            );

            this.confirmDeletion = false;
            this.distanceToDelete = null;

            this.showSuccessSnackBar(
                `Distance <strong>${name}</strong> has been deleted!`
            );

            this.onChange();
        },

        showSuccessSnackBar(message) {
            this.snackbarColor = 'green darken-1';
            this.snackbarText = message;
            this.snackbar = true;
        },

        onEnter() {
            if (!this.distance) {
                this.openCustomDistanceDialog();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.distance-picker ::v-deep {
    position: relative;

    .v-input__slot {
        margin-bottom: 0;
        cursor: pointer;
    }

    .v-text-field__details {
        display: none;
    }

    .v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
        transform: rotate(0deg);
    }
}
</style>
