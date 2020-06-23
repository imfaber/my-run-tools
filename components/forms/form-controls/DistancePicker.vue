<template>
    <div class="distance-picker">
        <VAutocomplete
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
                <VListItemContent class="pt-0 pb-0">
                    <VListItemTitle>
                        <VBtn
                            class="ma-2"
                            text
                            small
                            color="primary"
                            @click="openCustomDistanceDialog"
                        >
                            <VIcon left>mdi-plus</VIcon> Add custom distance
                        </VBtn>
                    </VListItemTitle>
                </VListItemContent>
            </template>

            <template v-slot:item="{ item }">
                <VListItemContent>
                    <VListItemTitle>
                        {{ item.name }}
                    </VListItemTitle>
                </VListItemContent>
                <VListItemAction v-if="item.isCustom">
                    <div class="d-flex">
                        <VBtn
                            icon
                            small
                            color="primary"
                            @click.stop.prevent="editDistance(item)"
                        >
                            <VIcon>mdi-pencil</VIcon>
                        </VBtn>
                        <VBtn
                            icon
                            small
                            color="red"
                            @click.stop.prevent="
                                confirmDeletion = true;
                                distanceToDelete = item.id;
                                closeAutocompleteMenu();
                            "
                        >
                            <VIcon>mdi-delete</VIcon>
                        </VBtn>
                    </div>
                </VListItemAction>
            </template>
        </VAutocomplete>

        <ValueDisplay :value="distanceDisplay" @click="openMenu" />

        <FormCustomDistanceDialog
            v-if="customDistanceDialog"
            v-model="customDistanceDialog"
            persistent
            max-width="350px"
            :distance="distanceToEdit"
            :distances-list="distancesList"
            @close="closeCustomDistanceDialog"
        />

        <VDialog
            v-if="confirmDeletion"
            v-model="confirmDeletion"
            max-width="310"
        >
            <VCard>
                <VCard-title class="headline">
                    Delete custom distance
                </VCard-title>

                <VCard-text>
                    You are about to delete
                    <strong class="red--text">
                        {{ getDistanceById(distanceToDelete).name }}
                    </strong>
                </VCard-text>

                <VCardActions>
                    <VSpacer />

                    <VBtn
                        color="grey"
                        text
                        @click="
                            confirmDeletion = false;
                            distanceToDelete = null;
                        "
                    >
                        cancel
                    </VBtn>

                    <VBtn color="red" dark @click="deleteDistance()">
                        <VIcon left small>mdi-delete</VIcon>
                        Delete
                    </VBtn>
                </VCardActions>
            </VCard>
        </VDialog>

        <VSnackbar
            v-model="snackbar"
            :timeout="3000"
            :color="snackbarColor"
            light
        >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="snackbarText"></span>
            <VBtn icon fab x-small dark @click="snackbar = false">
                <VIcon>mdi-close</VIcon>
            </VBtn>
        </VSnackbar>
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
import parseUnit from 'parse-unit';
import FormCustomDistanceDialog from '../FormCustomDistanceDialog';
import ValueDisplay from './ValueDisplay';
import { isValidUnit } from '~/utils/unit-system.ts';
import { Measure } from '~/utils/types.ts';

export default {
    components: { ValueDisplay, FormCustomDistanceDialog },

    props: {
        /**
         * The value
         */
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
        if (!this.$refs.inputField) {
            return;
        }

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

            const unit = isValidUnit(Measure.Length, parsed[1])
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

    div.v-autocomplete__content.v-menu__content {
        margin-top: -7px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
            0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 5px 5px 0px rgba(0, 0, 0, 0.12);
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
}
</style>
