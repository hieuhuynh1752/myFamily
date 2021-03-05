import gql from 'graphql-tag';

export const REQUEST_UPDATE_INVITE_STATUS = gql`
  mutation updateInviteStatus($id: ID!, $status: Boolean!) {
    updateInviteStatus(
      input: {
        id:$id
        status: $status
      }
    ) {
      id
      familyMember {
        id
        family {
          id
          name
        }
        user {
          id
          name
        }
      }
      email
      status
      created_at
      updated_at
    }
  }
`;
