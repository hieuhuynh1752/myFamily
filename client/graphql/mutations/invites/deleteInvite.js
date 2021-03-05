import gql from 'graphql-tag';

export const REQUEST_CREATE_INVITE = gql`
  mutation deleteInvite($id: ID!) {
    deleteInvite(input: {id: $id}) {
      id
    }
  }
`;
