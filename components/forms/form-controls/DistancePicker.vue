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
            <template #prepend-item>
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

            <template #item="{ item }">
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
                                $refs.inputField.$refs.menu.isActive = false;
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
                        {{
                            runningEventStore.getEventById(distanceToDelete)
                                .name
                        }}
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

<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
import { VAutocomplete } from 'vuetify/lib';
import parseUnit from 'parse-unit';
import { RunningEvent } from '~/utils/types';
import { isValidUnit } from '~/utils/unit-system.ts';
import { Measure } from '~/utils/types.ts';

@Component
export default class DistancePicker extends Vue {
    @Prop({ default: '' }) readonly value: string | undefined;

    $refs!: {
        inputField: InstanceType<typeof VAutocomplete>;
    };

    distance? = this.value;
    searchInput? = '';
    customDistanceDialog = false;
    confirmDeletion: boolean | string = false;
    distanceToEdit?: RunningEvent;
    distanceToDelete?: string;
    snackbar = false;
    snackbarText? = '';
    snackbarColor? = '';
    isReadOnly = this.$vuetify.breakpoint.xs;
    isPickerActive = false;
    inputElement?: HTMLInputElement | null;

    mounted() {
        if (!this.$refs.inputField) {
            return;
        }

        this.inputElement = this.$refs.inputField.$el.querySelector('input');

        if (!this.inputElement) {
            return;
        }

        this.$watch('$refs.inputField.$refs.menu.isActive', (value) => {
            this.isPickerActive = value;

            if (!value) {
                this.isReadOnly = true;

                if (this.inputElement) {
                    this.inputElement.blur();
                }
            }
        });
    }

    get distancesList() {
        return this.$runningEventStore.events;
    }

    get distanceDisplay() {
        const distance = this.$runningEventStore.getEventById(this.distance);

        if (distance) {
            return `${distance.value} ${distance.unit}`;
        }

        return '...';
    }

    get keyboardIcon() {
        if (this.$vuetify.breakpoint.xs && this.isPickerActive) {
            return this.canEdit ? 'mdi-keyboard-close' : 'mdi-keyboard';
        }
        return '';
    }

    get canEdit() {
        if (!this.isPickerActive) {
            return true;
        }

        return !this.$vuetify.breakpoint.xs || !this.isReadOnly;
    }

    @Watch('value')
    onChildChanged(value: string) {
        this.distance = value;
    }

    openCustomDistanceDialog() {
        if (!this.distanceToEdit) {
            const parsedDistance = this.parseDistanceString(
                this.searchInput || ''
            );

            this.distanceToEdit = {
                name: this.searchInput,
                ...parsedDistance
            } as RunningEvent;
        }

        this.customDistanceDialog = true;
        (this.$refs.inputField.$refs.menu as any).isActive = false;
    }

    openMenu() {
        setTimeout(() => {
            (this.$refs.inputField.$refs.menu as any).isActive = true;
        });
    }

    parseDistanceString(distance: string) {
        const parsed = parseUnit(distance);
        const value = parsed[0];

        if (parsed[1] === 'k') parsed[1] = 'km';

        const unit = isValidUnit(Measure.Length, parsed[1]) ? parsed[1] : null;

        return { value, unit };
    }

    closeCustomDistanceDialog(data: {
        isEdit: boolean;
        distance: RunningEvent;
    }) {
        this.customDistanceDialog = false;
        this.distanceToEdit = undefined;

        if (!data) {
            return;
        }

        const { isEdit, distance } = data;

        this.distance = ''; // Invalidate cache
        this.distance = distance.id;
        this.searchInput = distance.name;

        this.showSuccessSnackBar(
            `Distance <strong>${distance.name}</strong> has been ${
                isEdit ? 'updated' : 'added'
            }!`
        );

        this.onChange();
    }

    onChange() {
        setTimeout(() => {
            this.$emit('change', this.distance);
        });
    }

    editDistance(distance: RunningEvent) {
        this.distanceToEdit = {
            ...this.$runningEventStore.getEventById(distance.id)
        } as RunningEvent;
        this.openCustomDistanceDialog();
    }

    deleteDistance() {
        if (this.confirmDeletion === this.distance) {
            this.distance = undefined;
        }

        const event = this.$runningEventStore.getEventById(
            this.distanceToDelete
        );

        if (!event) {
            return;
        }

        this.$runningEventStore.delete(event);

        this.confirmDeletion = false;
        this.distanceToDelete = undefined;

        this.showSuccessSnackBar(
            `Distance <strong>${event.name}</strong> has been deleted!`
        );

        this.onChange();
    }

    showSuccessSnackBar(message: string) {
        this.snackbarColor = 'green darken-1';
        this.snackbarText = message;
        this.snackbar = true;
    }

    onEnter() {
        if (!this.distance) {
            this.openCustomDistanceDialog();
        }
    }
}
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
