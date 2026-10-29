import { gql } from '@apollo/client';
export const REPOSITORY_FIELDS = gql`
  fragment RepositoryFields on Repository {
    id fullName description language forksCount stargazersCount ratingAverage reviewCount ownerAvatarUrl url
  }
`;
export const GET_REPOSITORIES = gql`
  query Repositories($first: Int, $after: String, $orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String) {
    repositories(first: $first, after: $after, orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword) {
      edges { cursor node { ...RepositoryFields } }
      pageInfo { hasNextPage endCursor }
    }
  }
  ${REPOSITORY_FIELDS}
`;
export const GET_REPOSITORY = gql`
  query Repository($id: ID!, $first: Int, $after: String) {
    repository(id: $id) {
      ...RepositoryFields
      reviews(first: $first, after: $after) {
        edges { cursor node { id text rating createdAt repositoryId user { id username } } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;
export const ME = gql`
  query Me($includeReviews: Boolean = false, $first: Int, $after: String) {
    me {
      id username
      reviews(first: $first, after: $after) @include(if: $includeReviews) {
        edges { cursor node { id text rating createdAt repositoryId user { id username } repository { id fullName } } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;
export const AUTHENTICATE = gql`mutation Authenticate($credentials: AuthenticateInput!) { authenticate(credentials: $credentials) { accessToken } }`;
export const CREATE_USER = gql`mutation CreateUser($user: CreateUserInput!) { createUser(user: $user) { id username } }`;
export const CREATE_REVIEW = gql`mutation CreateReview($review: CreateReviewInput!) { createReview(review: $review) { id repositoryId } }`;
export const DELETE_REVIEW = gql`mutation DeleteReview($id: ID!) { deleteReview(id: $id) }`;
