import { addDecorator, addParameters } from '@storybook/vue';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withInfo } from 'storybook-addon-vue-info';
import Vue from 'vue';
import Vuetify from 'vuetify';
import store from '~/.storybook/store.js';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

// Global decorators
addDecorator(() => ({
    vuetify: new Vuetify({
        customVariables: ['~/assets/variables.scss'],
        treeShake: true,
        theme: {
            options: {
                customProperties: true
            },
            themes: {
                dark: {
                    primary: '#363636'
                },
                light: {
                    primary: '#2196F3'
                }
            }
        }
    }),
    store,
    template: '<v-app><div class="pa-6"><story/></div></v-app>'
}));
addDecorator(withInfo);

addParameters({
    options: {
        storySort: (a, b) => {
            const aWeight =
                'weight' in a[1].parameters ? a[1].parameters.weight : 0;
            const bWeight =
                'weight' in b[1].parameters ? b[1].parameters.weight : 0;
            return a[1].kind === b[1].kind ? 0 : aWeight >= bWeight;
        }
    }
});

addParameters({
    viewport: {
        viewports: {
            ...INITIAL_VIEWPORTS
        }
    }
});
