import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { toggleNav } from '../actions/ui';

export interface UIState {
    navOpen: boolean;
}

const INITAL_UI_STATE: UIState = {
    navOpen: false,
};

const toggleNavReducer = (state: UIState) => ({
    ...state,
    navOpen : !state.navOpen,
});

export const uiReducer =
    reducerWithInitialState(INITAL_UI_STATE)
        .case(toggleNav, toggleNavReducer)
        .build();
