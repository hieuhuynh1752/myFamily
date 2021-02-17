import gql from 'graphql-tag';

export const REQUEST_UPDATE_POST = gql`
  mutation updatePost($id: ID!, $content: String!) {
    updatePost(input: {id: $id, content: $content}) {
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
        id
        familyMember{
          id
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
