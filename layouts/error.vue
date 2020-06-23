<template>
    <VCard class="mx-auto text-center pa-10" width="600">
        <h1 v-if="error.statusCode === 404" class="font-weight-regular">
            {{ pageNotFound }}
        </h1>
        <h1 v-else class="font-weight-regular">
            {{ otherError }}
        </h1>

        <NuxtLink to="/" class="mt-4 d-block">
            Go back to the Home page
        </NuxtLink>
    </VCard>
</template>

<script>
export default {
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: 'Ooops, we could not find this page!',
            otherError: 'Ooops, something went wrong!'
        };
    },
    head() {
        const title =
            this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
        return {
            title
        };
    }
};
</script>
