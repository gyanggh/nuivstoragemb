import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router'; // react-router v4
import { ConnectedRouter } from 'connected-react-router';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { store, history } from './store';

const paths = (
    <div>
        <Switch>
            <Route exact path="/" component={App} />
            <Route render={() => (<div>404 idk</div>)} />
        </Switch>
    </div>
);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history} children={paths} />
    </Provider>,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
