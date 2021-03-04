import gql from 'graphql-tag';

export const REQUEST_DELETE_TO_DO = gql`
  mutation deleteToDo($id: ID!) {
    deleteToDo(id: $id) {
      id
    }
  }
`;
