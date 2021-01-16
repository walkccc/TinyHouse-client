import React, { useEffect, useRef } from 'react';

import { useApolloClient, useMutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { appStrings } from '../../i18n';
import { LoginType } from '../../lib/graphql/globalTypes';
import { LOG_IN } from '../../lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables,
} from '../../lib/graphql/mutations/LogIn/__generated__/LogIn';
import { AUTH_URL } from '../../lib/graphql/queries';
import {
  AuthUrl as AuthUrlData,
  AuthUrlVariables,
} from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import { Viewer } from '../../lib/types';

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { LOGIN: lang } = appStrings;

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [logIn, { data, loading, error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        sessionStorage.setItem('token', data.logIn.token);
        setViewer(data.logIn);
        <h3>{lang.onCompleted}</h3>;
      }
    },
    onError: () => {
      <h3>{lang.error}</h3>;
    },
  });
  const logInRef = useRef(logIn);

  const handleAuth = async (loginType: LoginType) => {
    try {
      const { data } = await client.query<AuthUrlData, AuthUrlVariables>({
        query: AUTH_URL,
        variables: {
          loginType,
        },
      });
      window.location.href = data.authUrl;
    } catch (error) {
      <h3>{lang.error}</h3>;
    }
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    const loginType =
      window.location.href.indexOf('github') > -1 ? LoginType.GITHUB : LoginType.GOOGLE;

    if (code) {
      logInRef.current({
        variables: {
          input: {
            code,
            loginType,
          },
        },
      });
    }
  }, []);

  if (loading) {
    return (
      <div>
        <h2>/login</h2>
        <h3>{lang.loading}</h3>
      </div>
    );
  }

  if (data && data.logIn) {
    const { id } = data.logIn;
    return <Redirect to={`/user/${id}`} />;
  }

  const errorMessage = error ? <h3>{lang.error}</h3> : null;

  return (
    <div>
      <h2>/login</h2>
      {errorMessage}
      <button onClick={() => handleAuth(LoginType.GITHUB)}>{lang.loginVia('GitHub')}</button>
      <button onClick={() => handleAuth(LoginType.GOOGLE)}>{lang.loginVia('Google')}</button>
    </div>
  );
};
