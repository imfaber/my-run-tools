import tools from '~/data/tools';

export default {
    head() {
        const { title } = tools.find((x) => x.name === this.$route.name);
        return {
            title
        };
    }
};
