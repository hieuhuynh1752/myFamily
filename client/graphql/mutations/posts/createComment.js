import gql from 'graphql-tag';

export const REQUEST_CREATE_COMMENT = gql`
  mutation createComment($memberid: ID!, $postid: ID!, $content: String!) {
    createComment(
      input: {
        familyMember: {connect: $memberid}
        post: {connect: $postid}
        content: $content
      }
    ) {
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
  }
`;
