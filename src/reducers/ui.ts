import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { toggleNav, closeNav, setSearchWord, openModal,
    closeModal,
    toggleAdvancedSearch,
} from '../actions/ui';
import { ReactNode } from 'react';

export interface UIState {
    navOpen: boolean;
    searchWord:string;
    modal?: ModalState;
    advancedSearch:boolean;
}

export interface ModalState {
    children: [ReactNode, ReactNode, ReactNode];
    direction: 'right' | 'left' ;
}

const INITAL_UI_STATE: UIState = {
    navOpen: false,
    searchWord : '',
    advancedSearch:false,
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

const openModalReducer = (state: UIState, payload: ModalState) => ({
    ...state,
    modal : payload,
});

const closeModalReducer = (state: UIState) => {
    const { modal, ...rest } = state;
    return rest;
};

const searchToggleReducer = (state: UIState) => ({
    ...state,
    advancedSearch:!state.advancedSearch,
});

export const uiReducer =
    reducerWithInitialState(INITAL_UI_STATE)
        .case(toggleNav, toggleNavReducer)
        .case(closeNav, closeNavReducer)
        .case(setSearchWord, setSearchWordReducer)
        .case(openModal, openModalReducer)
        .case(closeModal, closeModalReducer)
        .case(toggleAdvancedSearch, searchToggleReducer)
        .build();
