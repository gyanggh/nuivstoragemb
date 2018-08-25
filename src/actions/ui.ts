import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('ui');

export const toggleNav = actionCreator<void>('TOGGLE_NAVBAR');
export const closeNav = actionCreator<void>('CLOSE_NAV');
