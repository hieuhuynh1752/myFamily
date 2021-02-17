import gql from 'graphql-tag';

export const REQUEST_CREATE_LIKE = gql`
  mutation createLike($memberid: ID!, $postid: ID!) {
    createLike(
      input: {familyMember: {connect: $memberid}, post: {connect: $postid}}
    ) {
      id
      familyMember {
        user {
          id
          name
        }
      }
    }
  }
`;
