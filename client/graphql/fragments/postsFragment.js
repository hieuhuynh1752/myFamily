import gql from 'graphql-tag';

export const POSTS_FRAGMENT = gql`
  fragment NewPost on Post {
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
      familyMember {
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
`;
