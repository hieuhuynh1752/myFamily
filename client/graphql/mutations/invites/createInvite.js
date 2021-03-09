import gql from 'graphql-tag';

export const REQUEST_CREATE_INVITE = gql`
  mutation createInvite($memberid: ID!, $email: String!, $status: Boolean!) {
    createInvite(
      input: {
        familyMember: {connect: $memberid}
        email: $email
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
