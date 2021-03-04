import gql from 'graphql-tag';

export const REQUEST_UPDATE_TO_DO_STATUS = gql`
  mutation updateToDoStatus(
    $id: ID!
    $is_completed: Boolean!
  ) {
    updateToDoStatus(
      input: {
        id: $id
        is_completed: $is_completed
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
