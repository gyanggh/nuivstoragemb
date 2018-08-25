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
import { Navbar } from './components/navbar';

import { I18n } from 'aws-amplify';

export interface RoutePath{
    name: string;
    path: string;
    component: React.ComponentType<any>;
}
const paths : RoutePath[] = [
    {
        name:'Home',
        path:'/',
        component:App,
    },
    {
        name:'Test',
        path:'/test',
        component: () => (<div>Lol test</div>),
    },
];

const dict = {
    en: {
        'Sign In': 'Sign In',
        'Sign Up': 'Sign Up',
        Feed: 'Feed',
        Videos: 'Videos',
    },
};

I18n.putVocabularies(dict);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history} >
            <div>
                <Switch>
                    <Navbar paths={paths}/>
                </Switch>
                <Switch>
                    {
                        paths.map(path =>
                            <Route
                            exact
                            key={path.path}
                            path={path.path}
                            component={path.component}/>,
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
