import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router'; // react-router v4
import { ConnectedRouter } from 'connected-react-router';
import './index.css';
import * as reactstraptemp from 'reactstrap';
const { Jumbotron, UncontrolledCollapse, Button } = reactstraptemp as any;
import 'bootstrap/dist/css/bootstrap.css';
import registerServiceWorker from './registerServiceWorker';
import { store, history } from './store';
import { Navbar } from './components/navbar';
import { NewRecordPage, EditRecordPage, VideosList } from './components/videolist';
import { SideModal } from './components/modal';
// import { Dash } from './components/dash';
import { UploadIndicator } from './components/uploadIndicator';
import { flatten } from 'lodash';
import { translate } from './helpers';

import Amplify from 'aws-amplify';
import { Authenticator, Greetings } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

import ErrorBoundary from 'react-error-boundary';

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
    supress?: boolean;
    name: string;
    path: string;
    component: React.ComponentType<any>;
}
export interface RoutePathNode{
    page:false;
    nameBase: string;
    prefix: string;
    children: RoutePathEnd[];
}
export type RoutePath = {
    supress?: boolean;
}  & (RoutePathEnd | RoutePathNode);

const paths : RoutePath[] = [
    {
        page:true,
        name: 'Home',
        path:'/',
        component:App,
    }, {
        page:true,
        supress: true,
        name: 'Home',
        path:'/index.html',
        component:App,
    }, {
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
        }, {
            page:true,
            supress: true,
            name: 'Edit',
            path: '/edit/:id',
            component: props => EditRecordPage(props.match.params.id),
        }],
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
    // tslint:disable-next-line
}) => (props.authState === 'signedIn' ? <Provider store={store}>
            <ConnectedRouter history={history} >
                <div>
                    <Switch>
                        <Navbar paths={paths}/>
                    </Switch>
                    <div className="pt-5">
                        <Switch>
                            {renderRoutePath(paths)}
                             <Route component={NotFound} />
                        </Switch>
                    </div>
                    <div><SideModal/></div>
                    <UploadIndicator/>
                </div>
            </ConnectedRouter>
        </Provider> : null);

const ErrorMessage = ({ componentStack, error } : any) => (
    <Jumbotron style={{
        position: 'fixed',
        width:'100vw',
        height:'100vh',
    }}>
        <h1 className="display-3">{translate('Sorry!')} 😢</h1>
        <p className="lead">{translate('Something went wrong! Try reloading?')}</p>
        <hr className="my-2" />
        <p>{translate('If you want to know what went wrong, click here')}</p>
        <p className="lead">
          <Button id="stackToggler" color="danger">{translate('Error Log')}</Button>
          <UncontrolledCollapse toggler="#stackToggler">
              <p><h3>{translate('Error')}</h3> {error.toString()}</p>
              <p><h3>{translate('Stacktrace')}</h3> <pre>{componentStack}</pre></p>
          </UncontrolledCollapse>
        </p>
    </Jumbotron>
);

const NotFound = (props : any) => (
    <Jumbotron style={{
        position: 'fixed',
        width:'100vw',
        height:'100vh',
    }}>
        <h1 className="display-3">{translate('Sorry!')} 😢</h1>
        <hr className="my-2" />
        <p className="lead">{translate('Cant find that page!')}</p>
    </Jumbotron>
);
ReactDOM.render(
    <ErrorBoundary FallbackComponent={ErrorMessage}>
        <Authenticator hide={[Greetings]}>
            <AppContainers />
        </Authenticator>
    </ErrorBoundary>,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
