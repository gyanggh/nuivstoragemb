import * as React from 'react';
import { I18n } from 'aws-amplify';

import './App.css';

import logoSvg from './logo.svg';

const dict = {
    en: {
        'Sign In': 'Sign In',
        'Sign Up': 'Sign Up',
        'Feed': 'Feed',
        'Videos': 'Videos',
    },
};


I18n.putVocabularies(dict);

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logoSvg} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
            </div>
        );
    }
}

export default App;
