import gql from 'graphql-tag';

export const REQUEST_GET_INVITES_BY_MEMBERS = gql`
  query invites($membersid: Mixed) {
    invites(
      where: {column: MEMBER_ID, operator: IN, value: $membersid}
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

export const REQUEST_GET_INVITES_BY_EMAIL = gql`
  query invites($email: Mixed) {
    invites(
      where: {
        AND: [
          {column: EMAIL, value: $email}
          {column: STATUS, value: "false"}
        ]
      }
      order: [{column: CREATED_AT, order: DESC}]
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
