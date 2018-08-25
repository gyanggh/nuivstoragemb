import actionCreatorFactory from 'typescript-fsa';
import { bindThunkAction } from 'typescript-fsa-redux-thunk';
 
const actionCreator = actionCreatorFactory('ui');

export const toggleNav = actionCreator<void>('TOGGLE_NAVBAR');
