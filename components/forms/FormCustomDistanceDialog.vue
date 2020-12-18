<template>
    <VDialog v-bind="{ ...$props, ...$attrs }">
        <VCard>
            <VForm ref="form" v-model="valid">
                <VCardTitle>
                    <span class="headline">{{ title }}</span>
                </VCardTitle>

                <VDivider />

                <VCardText>
                    <VContainer>
                        <VRow>
                            <VTextField
                                v-model="localDistance.name"
                                label="Distance name"
                                placeholder="E.g. My long run"
                                validate-on-blur
                                :rules="nameRules"
                                autocomplete="off"
                                class="mb-4"
                            />
                            <VTextField
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
                                    <VSelect
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
                                    ></VSelect>
                                </template>
                            </VTextField>

                            <VAlert v-if="error" dense type="error">
                                <!-- eslint-disable-next-line vue/no-v-html -->
                                <span v-html="error"></span>
                            </VAlert>
                        </VRow>
                    </VContainer>
                </VCardText>
                <VDivider />
                <VCardActions class="pr-6 pl-6 pt-4 pb-4">
                    <VBtn color="blue darken-1" text @click="$emit('close')">
                        Cancel
                    </VBtn>
                    <VSpacer />
                    <VBtn color="primary" type="submit" @click="save"
                        >Save</VBtn
                    >
                </VCardActions>
            </VForm>
        </VCard>
    </VDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RunningEvent } from '~/utils/types';
import { getUnits } from '~/utils/unit-system.ts';
import { Measure } from '~/utils/types.ts';

const distanceDefault = {
    isCustom: false,
    name: undefined,
    value: undefined,
    unit: undefined
};

@Component
export default class FormCustomDistanceDialog extends Vue {
    @Prop({ default: () => distanceDefault })
    readonly distance!: RunningEvent;

    @Prop({ default: () => [] })
    readonly distancesList!: Array<RunningEvent>;

    $refs!: {
        form: any;
    };

    valid = false;
    error = null;

    unitsList = getUnits(Measure.Length, this.$settingsStore.unitSystem).map(
        (x) => ({
            text: x.plural,
            value: x.abbr
        })
    );

    localDistance = {
        ...distanceDefault,
        unit: this.unitsList[0].value,
        ...this.distance
    };

    nameRules = [
        (v: string) => !!v || 'Distance name is required',
        (v: string) =>
            !this.distancesList.find(
                (x) => x.name === v && x.id !== this.localDistance.id
            ) || 'This name is already taken',
        (v: string) =>
            (v && v.length > 1) || 'Distance name must be more than 1 character'
    ];

    distanceRules = [
        (v: string) => !!v || 'Distance is required',
        (v: string) =>
            (v && parseInt(v) > 0) || 'Distance must be greater than 0'
    ];

    get isEdit() {
        return this.localDistance.isCustom;
    }

    get title() {
        const action = this.isEdit ? 'Edit' : 'Add';
        return `${action} custom distance`;
    }

    async save() {
        this.$refs.form.validate();

        if (!this.valid) {
            return;
        }

        const distance = await this.$runningEventStore[
            this.isEdit ? 'edit' : 'add'
        ](this.localDistance);

        this.$emit('close', { isEdit: this.isEdit, distance });
    }
}
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
