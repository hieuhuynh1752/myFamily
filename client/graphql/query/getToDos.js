import gql from 'graphql-tag';

export const REQUEST_GET_TO_DOS = gql`
  query ToDos($membersid: Mixed) {
    toDos(where: {column: MEMBER_ID, operator: IN, value: $membersid}) {
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
