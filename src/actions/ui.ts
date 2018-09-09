import actionCreatorFactory from 'typescript-fsa';
import { ModalState } from '../reducers/ui';

const actionCreator = actionCreatorFactory('ui');

export const toggleNav = actionCreator<void>('TOGGLE_NAVBAR');
export const closeNav = actionCreator<void>('CLOSE_NAV');

export const setSearchWord = actionCreator<string>('SEARCH_FOR');

export const openModal = actionCreator<ModalState>('OPEN_MODAL');

export const closeModal = actionCreator<void>('CLOSE_MODAL');

export const toggleAdvancedSearch = actionCreator<void>('TOGGLE_SEARCH');
