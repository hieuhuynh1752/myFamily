import gql from 'graphql-tag';

export const REQUEST_CREATE_POST = gql`
  mutation createPost($memberid: ID!, $content: String!) {
    createPost(input: {familyMember: {connect: $memberid}, content: $content}) {
      id
      familyMember {
        id
        user {
          id
          name
        }
      }
      content
      like{
        familyMember{
          user{
            id,
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
