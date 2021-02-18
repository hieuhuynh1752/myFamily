import gql from 'graphql-tag';

export const REQUEST_DELETE_COMMENT = gql`
  mutation deleteComment($commentid: ID!) {
    deleteComment(id: $commentid) {
      id
    }
  }
`;
