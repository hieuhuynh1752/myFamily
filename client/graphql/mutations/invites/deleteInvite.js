import gql from 'graphql-tag';

export const REQUEST_DELETE_INVITE = gql`
  mutation deleteInvite($id: ID!) {
    deleteInvite(input: {id: $id}) {
      id
    }
  }
`;
