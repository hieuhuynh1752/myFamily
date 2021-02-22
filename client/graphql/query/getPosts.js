import gql from 'graphql-tag';

export const REQUEST_GET_POSTS = gql`
  query posts($membersid: Mixed) {
    posts(
      where: {column: MEMBER_ID, operator: IN, value: $membersid}
      order: [{column: CREATED_AT, order: DESC}]
    ) {
      id
      familyMember {
        id
        user {
          id
          name
        }
      }
      content
      like {
        id
        familyMember {
          id
          user {
            id
            name
          }
        }
      }
      comment {
        id
        content
        created_at
        familyMember {
          id
          user {
            id
            name
          }
        }
      }
      created_at
      updated_at
    }
  }
`;
