import {createI18n} from 'vue-i18n';

// import translations
import en from '@/locales/en.json';

const i18n = createI18n({
    legacy: false,
    locale: import.meta.env.VUE_APP_I18N_LOCALE || "en",
    fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    globalInjection: true,
    warnHtmlMessage: false,
    messages: {
        en: {
            ...en
        }
    }
});

export default i18n;
