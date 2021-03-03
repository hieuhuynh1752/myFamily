import gql from 'graphql-tag';

export const REQUEST_GET_EVENTS = gql`
  query events($membersid: Mixed) {
    events(where: {column: MEMBER_ID, operator: IN, value: $membersid}) {
      id
      familyMember {
        id
        user {
          id
          name
        }
      }
      title
      description
      start_date_time
      end_date_time
      color
      recurrence
      location
      participants_id
      reminder
      created_at
      updated_at
    }
  }
`;
