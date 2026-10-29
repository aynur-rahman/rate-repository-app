import { gql } from '@apollo/client';
export const GET_REPOSITORIES = gql`
  query Repositories {
    repositories {
      edges { node { id fullName description language forksCount stargazersCount ratingAverage reviewCount ownerAvatarUrl } }
    }
  }
`;
export const ME = gql`query Me { me { id username } }`;
export const AUTHENTICATE = gql`mutation Authenticate($credentials: AuthenticateInput!) { authenticate(credentials: $credentials) { accessToken } }`;
