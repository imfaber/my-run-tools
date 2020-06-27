<template>
    <div></div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
// import { runningEventStore } from '~/store';
import { VAutocomplete, VMenu } from 'vuetify/lib';
import runningEvent from '~/store/runningEvent.ts';
import settings from '~/store/settings.ts';
import { RunningEvent } from '~/utils/types';

// import { mapGetters, mapState, mapMutations } from 'vuex';
// import parseUnit from 'parse-unit';
// import FormCustomDistanceDialog from '../FormCustomDistanceDialog';
// import ValueDisplay from './ValueDisplay';
// import { isValidUnit } from '~/utils/unit-system.ts';
// import { Measure } from '~/utils/types.ts';
// import { getImperialUnits } from '../../../utils/unit-system';

// HelloWorld class will be a Vue component
@Component({
    // components: { ValueDisplay, FormCustomDistanceDialog }
})
export default class DistancePickerTs extends Vue {
    $refs!: {
        inputField: InstanceType<typeof VAutocomplete>;
        ['inputField.$refs.menu']: InstanceType<typeof VMenu>;
    };

    distance = '';
    searchInput = '';
    customDistanceDialog = false;
    confirmDeletion = null;
    distanceToEdit?: RunningEvent;
    distanceToDelete = null;
    snackbar = false;
    snackbarText = null;
    snackbarColor = null;
    isReadOnly = this.$vuetify.breakpoint.xs;
    isPickerActive = false;
    inputElement?: HTMLInputElement | null;
    runningEvent = getModule(runningEvent, this.$store);
    settings = getModule(settings, this.$store);

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

    get distanceDisplay() {
        const distance = this.runningEvent.getEventById(this.distance);

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
            const parsedDistance = this.parseDistanceString(this.searchInput);

            this.distanceToEdit = {
                name: this.searchInput,
                ...parsedDistance
            } as RunningEvent;
        }

        this.customDistanceDialog = true;
        this.$refs.inputField.$refs.menu.isActive = false;
    }

    openMenu() {
        setTimeout(() => {
            (this.$refs.inputField.$refs.menu as VueIns).isActive = true;
        });
    }

    parseDistanceString(distance) {
        const parsed = parseUnit(distance);
        const value = parsed[0];

        if (parsed[1] === 'k') parsed[1] = 'km';

        const unit = isValidUnit(Measure.Length, parsed[1]) ? parsed[1] : null;

        return { value, unit };
    }

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
    }

    onChange() {
        setTimeout(() => {
            this.$emit('change', this.distance);
        });
    }

    editDistance(distance) {
        this.distanceToEdit = { ...distance };
        this.openCustomDistanceDialog();
    }

    deleteDistance() {
        if (this.confirmDeletion === this.distance) {
            this.distance = null;
        }

        const { name } = this.getDistanceById(this.distanceToDelete);

        this.$store.dispatch('runningEvent/deleteEvent', this.distanceToDelete);

        this.confirmDeletion = false;
        this.distanceToDelete = null;

        this.showSuccessSnackBar(
            `Distance <strong>${name}</strong> has been deleted!`
        );

        this.onChange();
    }

    showSuccessSnackBar(message) {
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
