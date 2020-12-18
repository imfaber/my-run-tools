<template>
    <v-container class="pt-0" fluid>
        <v-row align="center" justify="center" class="mb-8">
            <v-col cols="12" sm="8" md="6" lg="4">
                <tool-selector></tool-selector>
            </v-col>
        </v-row>
        <nuxt-child />
    </v-container>
</template>

<script>
export default {};
</script>
