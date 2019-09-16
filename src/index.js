import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from "./context/auth-context"
import Auth from './components/Auth';

ReactDOM.render(
<AuthContextProvider>
    <App />
</AuthContextProvider>
, document.getElementById('root'));
