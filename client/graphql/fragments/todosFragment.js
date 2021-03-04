import gql from 'graphql-tag';

export const TODOS_FRAGMENT = gql`
  fragment NewToDo on ToDo {
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
`;
