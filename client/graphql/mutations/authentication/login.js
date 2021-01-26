import gql from 'graphql-tag'

export const REQUEST_LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(input: {
      username: $username,
      password: $password
    }) {
      access_token
      user {
         id
        name
        email
      }
    }
  }
`