import { gql } from 'apollo-boost';

export const AUTH_URL = gql`
  query AuthUrl($loginType: LoginType!) {
    authUrl(loginType: $loginType)
  }
`;
