import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router'; // react-router v4
import { ConnectedRouter } from 'connected-react-router';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import registerServiceWorker from './registerServiceWorker';
import { store, history } from './store';

const paths = [
    {
        name:'Home',
        path:'/',
        component:App,
    },
];

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history} >
            <div>
                <Switch>
                    {
                        paths.map((path) =>
                            <Route exact path={path.path} component={path.component}/>,
                        )
                    }
                     <Route render={() => (<div>404 lol idk</div>)} />
                </Switch>
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
