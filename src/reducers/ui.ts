import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { toggleNav, closeNav, setSearchWord, openModal, closeModal } from '../actions/ui';
import { ReactNode } from 'react';

export interface UIState {
    navOpen: boolean;
    searchWord:string;
    modal: Partial<ModalState>;
}

export interface ModalState {
    children: [ReactNode, ReactNode, ReactNode];
    direction: 'right' | 'left' ;
}

const INITAL_UI_STATE: UIState = {
    navOpen: false,
    searchWord : '',
    modal : {},
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

const closeModalReducer = (state: UIState) => ({
    ...state,
    modal : {},
});

export const uiReducer =
    reducerWithInitialState(INITAL_UI_STATE)
        .case(toggleNav, toggleNavReducer)
        .case(closeNav, closeNavReducer)
        .case(setSearchWord, setSearchWordReducer)
        .case(openModal, openModalReducer)
        .case(closeModal, closeModalReducer)
        .build();
