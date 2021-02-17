import gql from 'graphql-tag';

export const REQUEST_DELETE_LIKE = gql`
  mutation unLike($likeid: ID!) {
    unLike(id: $likeid) {
      id
    }
  }
`;
