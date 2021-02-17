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
`;

export const NEW_LIKE_FRAGMENT = gql`
  fragment NewLike on Like {
    id
    familyMember {
      id
      user {
        id
        name
      }
    }
  }
`;

export const NEW_COMMENT_FRAGMENT = gql`
  fragment NewComment on Comment {
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
`;
