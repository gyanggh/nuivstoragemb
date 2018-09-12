import * as React from 'react';
import { translate } from './helpers';

import './App.css';

import logoSvg from './logo.svg';

export default class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logoSvg} className="App-logo" alt="logo" />
                    <h1 className="App-title">{translate('Dash coming soon')}</h1>
                </header>
                <p className="App-intro">
                    {translate('Go Check Out Videos/List')}
                </p>
            </div>
        );
    }
}
