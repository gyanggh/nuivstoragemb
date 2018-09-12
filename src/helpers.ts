import { I18n, Hub } from 'aws-amplify';

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

export const authListener : {
    readonly onHubCapsule: any;
    onAuth: (a:() => any) => void;
    events: (() => any)[];
} = {
    onHubCapsule: (capsule : any) => {
        switch (capsule.payload.event) {
            case 'signIn':
            case 'configured':
                authListener.events.forEach(a => a());
                break;
            case 'signUp':
            case 'signOut':
            case 'signIn_failure':
                break;
        }
    },
    onAuth: a => authListener.events.push(a),
    events: [],
};

Hub.listen('auth', authListener);
