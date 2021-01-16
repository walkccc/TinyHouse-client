import React, { useEffect, useRef, useState } from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider, useMutation } from 'react-apollo';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { LOG_IN } from './lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables,
} from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import { Viewer } from './lib/types';
import reportWebVitals from './reportWebVitals';
import { AppHeader, Home, Login, User } from './sections';

// "proxy": "http://localhost:8000" in package.json
const client = new ApolloClient({
  uri: '/api',
  request: async (operation) => {
    const token = sessionStorage.getItem('token');
    operation.setContext({
      headers: {
        'X-CSRF-TOKEN': token || '',
      },
    });
  },
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState(initialViewer);

  const [logIn] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem('token', data.logIn.token);
        } else {
          sessionStorage.removeItem('token');
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    // pass no variables -> log in via cookie
    logInRef.current();
  }, []);

  return (
    <div>
      <h1>GraphQL OAuth Boilerplate</h1>
      <BrowserRouter>
        <AppHeader viewer={viewer} setViewer={setViewer} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route exact path="/user/:id" component={User} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
