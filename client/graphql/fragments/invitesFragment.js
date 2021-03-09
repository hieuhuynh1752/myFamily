import gql from 'graphql-tag';

export const INVITES_FRAGMENT = gql`
  fragment NewInvite on Invite {
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
`;
