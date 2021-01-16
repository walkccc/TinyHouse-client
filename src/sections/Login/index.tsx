import React, { useEffect, useRef } from 'react';

import { GithubFilled, GoogleSquareFilled } from '@ant-design/icons';
import { Button, Card, Layout, Spin, Typography } from 'antd';
import { useApolloClient, useMutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { appStrings } from '../../i18n';
import { ErrorBanner } from '../../lib/components';
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
import { displayErrorMessage, displaySuccessNotification } from '../../lib/utils';

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

const { LOGIN: lang } = appStrings;

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [logIn, { data, loading, error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        sessionStorage.setItem('token', data.logIn.token);
        setViewer(data.logIn);
        displaySuccessNotification(lang.onCompleted);
      }
    },
    onError: () => {
      displayErrorMessage(lang.error);
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
      <Content className="log-in">
        <Spin size="large" tip={lang.loading} />
      </Content>
    );
  }

  if (data && data.logIn) {
    const { id } = data.logIn;
    return <Redirect to={`/user/${id}`} />;
  }

  const errorMessage = error ? <ErrorBanner description={lang.error} /> : null;

  return (
    <Content className="log-in">
      {errorMessage}
      <Card className="log-in-card">
        <div className="log-in-card__intro-title">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to HugeHouse!
          </Title>
          <Text>Sign in to book available rentals!</Text>
        </div>
        <br />
        <Button icon={<GithubFilled />} size="large" onClick={() => handleAuth(LoginType.GITHUB)}>
          Sign in with GitHub
        </Button>
        <br />
        <br />
        <Button
          icon={<GoogleSquareFilled />}
          size="large"
          onClick={() => handleAuth(LoginType.GOOGLE)}
        >
          Sign in with Google
        </Button>
        <br />
        <br />
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the the third parth consent form to sign in.
        </Text>
      </Card>
    </Content>
  );
};
