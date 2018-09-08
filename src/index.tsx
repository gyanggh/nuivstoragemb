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
import { NewRecordPage, VideosList } from './components/videolist';
import { flatten } from 'lodash';

import Amplify from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

Amplify.configure({
    Auth: {
        identityPoolId: 'us-west-2:277f4c68-6351-4694-bed7-c345fc5c7cf1',
        // REQUIRED - Amazon Cognito Region
        region: 'us-west-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-west-2_Vfbr9hUR9',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '5uk1j4ti7u3vm5l83fd6g4bmo6',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: true,
    },
    API: {
        endpoints: [
            {
                name: 'APIGateway',
                endpoint: 'https://rfkgf56u78.execute-api.us-west-2.amazonaws.com/Prod',
            },
        ],
    },
});

export interface RoutePathEnd {
    page: true;
    name: string;
    path: string;
    component: React.ComponentType<any>;
}
export type RoutePath = {
    page:false,
    nameBase: string;
    prefix: string;
    children: RoutePathEnd[];
} | RoutePathEnd;

const paths : RoutePath[] = [
    {
        page:true,
        name: 'Home',
        path:'/',
        component:App,
    },
    {
        page:true,
        name:'Test',
        path:'/test',
        component: () => (<div>Lol test</div>),
    },
    {
        page:false,
        nameBase:'Videos',
        prefix:'/videos',
        children : [{
            page:true,
            name:'New',
            path:'/new',
            component: NewRecordPage,
        }, {
            page:true,
            name: 'List',
            path: '/list',
            component: VideosList,
        }, /* {
            Edit machine's broken
            page:true,
            name: 'Edit',
            path: '/edit/*',
            component: props => EditRecordPage(props.match.params.splat),
        }*/],
    },
];
const renderSingleRoute = (path:RoutePath, prefix:string) =>  path.page ?  <Route
                            exact
                            key={prefix + path.path}
                            path={prefix + path.path}
                            component={path.component}/> : <div/> ;
const renderRoutePath = (paths: RoutePath[]) => flatten(paths.map(
    path => path.page ?
    renderSingleRoute(path, '') :
    path.children.map(childPath => renderSingleRoute(childPath, path.prefix)),
));
const AppContainers : React.SFC = (props: {
    authState: 'signIn' | 'signUp' | 'confirmSignIn' |
    'confirmSignUp' | 'forgotPassword' | 'verifyContact' | 'signedIn';
    authData: any;
    children:any;
}) => (props.authState === 'signedIn' ? <Provider store={store}>
            <ConnectedRouter history={history} >
                <div>
                    <Switch>
                        <Navbar paths={paths}/>
                    </Switch>
                    <div className="pt-5">
                        <Switch>
                            {renderRoutePath(paths)}
                             <Route render={() => (<div>404 lol idk</div>)} />
                        </Switch>
                    </div>
                </div>
            </ConnectedRouter>
        </Provider> : null);
ReactDOM.render(
    <Authenticator>
        <AppContainers />
    </Authenticator>,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
