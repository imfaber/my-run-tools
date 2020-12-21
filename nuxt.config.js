import colors from 'vuetify/es5/util/colors';

const title = 'MyRun.Tools';
const gtmKey = process.env.GTM_KEY;
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

export default {
    components: true,
    pwa: {
        manifest: {
            name: title,
            short_name: title,
            lang: 'en-US',
            categories: ['run', 'calcultor', 'converter'],
            theme_color: '#2196F3'
        }
    },
    /*
     ** Headers of the page
     */
    head: {
        titleTemplate: `%s - ${title}`,
        title,
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: [],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        { src: '~/plugins/vuex-persist', ssr: false },
        '~/plugins/store-accessor'
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        '@nuxt/typescript-build',
        // Doc: https://github.com/nuxt-community/stylelint-module
        '@nuxtjs/stylelint-module',
        '@nuxtjs/vuetify'
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/gtm',
        // Doc: https://axios.nuxtjs.org/usage
        // '@nuxtjs/axios',
        // Doc: https://github.com/nuxt-community/dotenv-module
        // '@nuxtjs/dotenv'
        [
            'nuxt-cookie-control',
            {
                cssPolyfill: true,
                controlButton: false,
                blockIframe: true,
                barPosition: 'bottom-right',
                colors: {
                    barTextColor: '#fff',
                    modalOverlay: '#000',
                    barBackground: '#2196F3',
                    barButtonColor: '#000',
                    modalTextColor: '#000',
                    modalBackground: '#fff',
                    modalOverlayOpacity: 0.8,
                    modalButtonColor: '#fff',
                    modalUnsavedColor: '#fff',
                    barButtonHoverColor: '#fff',
                    barButtonBackground: '#fff',
                    modalButtonHoverColor: '#fff',
                    modalButtonBackground: '#2196F3',
                    controlButtonIconColor: '#000',
                    controlButtonBackground: '#fff',
                    barButtonHoverBackground: '#333',
                    checkboxActiveBackground: '#2196F3',
                    checkboxInactiveBackground: '#aadaff',
                    modalButtonHoverBackground: '#329ef4',
                    checkboxDisabledBackground: '#ddd',
                    controlButtonIconHoverColor: '#fff',
                    controlButtonHoverBackground: '#000',
                    checkboxActiveCircleBackground: '#fff',
                    checkboxInactiveCircleBackground: '#fff',
                    checkboxDisabledCircleBackground: '#fff'
                },
                text: {
                    barTitle: 'Cookies',
                    barDescription:
                        'We use our own cookies and third-party cookies so that we can show you this website and better understand how you use it, with a view to improving the services we offer.',
                    acceptAll: 'Accept all',
                    declineAll: 'Delete all',
                    manageCookies: 'Manage cookies',
                    unsaved: 'You have unsaved settings',
                    close: 'Close',
                    save: 'Save',
                    necessary: 'Necessary cookies',
                    optional: 'Optional cookies',
                    functional: 'Functional cookies',
                    blockedIframe:
                        'To see this, please enable functional cookies',
                    here: 'here'
                }
            }
        ]
    ],
    cookies: {
        necessary: [
            {
                name: 'Default Cookies',
                description: 'Used for cookie control.',
                cookies: [
                    'cookie_control_consent',
                    'cookie_control_enabled_cookies'
                ]
            }
        ],
        optional: [
            {
                name: 'Google Analitycs',
                identifier: 'ga',
                description:
                    'Google Analitycs is used to generate statistical data on how the visitor uses the website.',
                initialState: true,
                async: true,
                cookies: ['_ga', '_gat', '_gid'],
                accepted: () => window.$nuxt.$gtm.init(gtmKey),
                declined: () => {}
            }
        ]
    },
    gtm: {
        debug: isDev,
        pageTracking: true,
        enabled: isProd
    },
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {},
    /*
     ** vuetify module configuration
     ** https://github.com/nuxt-community/vuetify-module
     */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        treeShake: true,
        theme: {
            options: {
                customProperties: true
            },
            themes: {
                dark: {
                    primary: '#363636',
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                },
                light: {
                    primary: '#2196F3',
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },
    /*
     ** Build configuration
     */
    build: {},
    router: {
        middleware: []
    }
};
