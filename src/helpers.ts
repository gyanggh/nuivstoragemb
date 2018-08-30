import { I18n } from 'aws-amplify';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

const dict = {
    en: {
        'Sign In': 'Sign In',
        'Sign Up': 'Sign Up',
        Feed: 'Feed',
        Videos: 'Videos',
    },
};

I18n.putVocabularies(dict);

export const translate = (text:string) => I18n.get(text, text);
