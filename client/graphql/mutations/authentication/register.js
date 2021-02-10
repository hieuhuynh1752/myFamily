import gql from 'graphql-tag';

export const REQUEST_REGISTER = gql`
  mutation register(
    $name: String!
    $email: String!
    $password: String!
    $password_confirmation: String!
  ) {
    register(
      input: {
        name: $name
        email: $email
        password: $password
        password_confirmation: $password_confirmation
      }
    ) {
      tokens {
        access_token
        user {
          id
          name
          email
        }
      }
    }
  }
`;
