<template>
    <v-layout column justify-center align-center>
        <v-container class="pt-0" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" class="text-center mb-8 wrapper">
                    <h1 class="font-weight-regular mb-4">
                        About
                    </h1>

                    <p class="font-weight-light title">
                        <span class="font-weight-regular">MyRun.Tools</span>
                        is an open source project that aggregates a set of
                        useful calculators and converters for amateur runners.
                    </p>
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col cols="12" class="text-center mb-8 wrapper">
                    <h2 class="font-weight-regular mb-3">
                        Found a bug or have a sugestion?
                    </h2>

                    <p class="font-weight-light title">
                        If you found something broken or you need a tool that is
                        not currently present, please reach out to me at: <br />
                        <v-btn
                            small
                            color="primary"
                            dark
                            link
                            fab
                            target="_blank"
                            class="mt-6 mx-2"
                            href="https://github.com/imfaber/run-tools/issues/new/choose"
                        >
                            <v-icon dark>mdi-github</v-icon>
                        </v-btn>
                        <v-btn
                            small
                            color="primary"
                            dark
                            link
                            fab
                            href="mailto:fabrizio@imfaber.me"
                            class="mt-6 mx-2"
                        >
                            <v-icon dark>mdi-at</v-icon>
                        </v-btn>
                        <v-btn
                            small
                            color="primary"
                            dark
                            link
                            fab
                            target="_blank"
                            class="mt-6 mx-2"
                            href="https://twitter.com/imfaber"
                        >
                            <v-icon dark>mdi-twitter</v-icon>
                        </v-btn>
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </v-layout>
</template>

<script>
export default {
    head: {
        title: 'About'
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    max-width: 600px;
}
</style>
