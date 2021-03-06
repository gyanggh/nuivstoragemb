import { createStore, combineReducers, compose, applyMiddleware, Reducer } from 'redux';
import { connectRouter, routerMiddleware, RouterState  } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Omit } from './helpers';
import thunk from 'redux-thunk';

import { UIState, uiReducer } from './reducers/ui';
import { RecordState, recordReducer } from './reducers/videoRecords';
import { UploadState, uploadReducer } from './reducers/videoUpload';
import { EventsState, eventReducer } from './reducers/userEvents';

const reducers = combineReducers<Omit<State, 'router'>>({
    ui: uiReducer,
    records: recordReducer,
    uploads: uploadReducer,
    events: eventReducer,
}) as Reducer<State>;

export interface State{
    ui: UIState;
    records: RecordState;
    router: RouterState;
    uploads: UploadState;
    events: EventsState;
}

export const history = createBrowserHistory();

const composeEnhancers =
    typeof window === 'object' &&
    // tslint:disable-next-line:no-string-literal
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ?
    // tslint:disable-next-line:no-string-literal
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
        // Specify extension's options like name, actionsBlacklist, actionsCreators, serialize...
        actionsBlacklist: [

        ],
    }) : compose;

const enhancer = composeEnhancers(
    // enable async/impure reducers
    applyMiddleware(
        routerMiddleware(history),
        thunk,
    ),
);

export const store = createStore(
    connectRouter(history)(reducers),
    enhancer,
);
