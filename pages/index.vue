<template>
    <v-layout column justify-center align-center>
        <v-container class="pt-0" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" class="text-center mb-8">
                    <h1 class="font-weight-regular">
                        <span class="font-weight-light">Welcome to</span>
                        RunTools
                    </h1>

                    <p class="font-weight-light title">
                        If you are a runner here are some tools you might find
                        useful!
                    </p>
                </v-col>
            </v-row>
            <v-row align="center" justify="center" class="mb-8">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <tool-selector :autocomplete="false"></tool-selector>
                </v-col>
            </v-row>
        </v-container>
    </v-layout>
</template>

<script>
import ToolSelector from '~/components/ToolSelector.vue';

export default {
    components: {
        ToolSelector
    },
    head: {
        title: 'Home'
    }
};
</script>
