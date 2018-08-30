import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { toggleNav, closeNav, setSearchWord } from '../actions/ui';

export interface UIState {
    navOpen: boolean;
    searchWord:string;
}

const INITAL_UI_STATE: UIState = {
    navOpen: false,
    searchWord : '',
};

const toggleNavReducer = (state: UIState) => ({
    ...state,
    navOpen : !state.navOpen,
});

const closeNavReducer = (state: UIState) => ({
    ...state,
    navOpen : false,
});

const setSearchWordReducer = (state: UIState, word: string) => ({
    ...state,
    searchWord : word,
});

export const uiReducer =
    reducerWithInitialState(INITAL_UI_STATE)
        .case(toggleNav, toggleNavReducer)
        .case(closeNav, closeNavReducer)
        .case(setSearchWord, setSearchWordReducer)
        .build();
