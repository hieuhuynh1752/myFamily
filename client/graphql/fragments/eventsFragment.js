import gql from 'graphql-tag';

export const EVENTS_FRAGMENT = gql`
  fragment NewEvent on Event {
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
`;
