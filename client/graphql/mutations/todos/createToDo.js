import gql from 'graphql-tag';

export const REQUEST_CREATE_TO_DO = gql`
  mutation createToDo(
    $memberid: ID!
    $assignee: ID!
    $name: String!
    $description: String!
    $is_completed: Boolean!
  ) {
    createToDo(
      input: {
        familyMember: {connect: $memberid}
        assignee_id: $assignee
        name: $name
        description: $description
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
