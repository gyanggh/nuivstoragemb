import { createStore, combineReducers, compose, applyMiddleware, Reducer } from 'redux';
import { connectRouter, routerMiddleware, RouterState  } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Omit } from './helpers';
import thunk from 'redux-thunk';


const reducers = combineReducers<Omit<State, 'router'>>({

}) as Reducer<State>;

interface State{
    router: RouterState;
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
