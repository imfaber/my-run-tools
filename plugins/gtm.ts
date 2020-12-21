import { Context } from '@nuxt/types';

interface IGtm {
    $gtm: {
        init(id: string): void;
        push(event: { event: string; [key: string]: any }): void;
    };

    $cookies: { consent: boolean };
}

declare module '@nuxt/types' {
    interface Context extends IGtm {}
}

declare module 'vue/types/vue' {
    interface Vue extends IGtm {}
}

export default function({ $gtm, $cookies }: Context) {
    if ($cookies.consent) {
        // $gtm.init('GTM-MC2VLVD');
    }
}
