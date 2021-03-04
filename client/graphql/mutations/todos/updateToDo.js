import gql from 'graphql-tag';

export const REQUEST_UPDATE_TO_DO = gql`
  mutation updateToDo(
    $id: ID!
    $assignee: ID!
    $name: String!
    $description: String!
  ) {
    updateToDo(
      input: {
        id: $id
        assignee_id: $assignee
        name: $name
        description: $description
      }
    ) {
      id
      assignee_id
      name
      description
      is_completed
      familyMember {
        id
        user {
          id
          name
        }
      }
      created_at
      updated_at
    }
  }
`;
