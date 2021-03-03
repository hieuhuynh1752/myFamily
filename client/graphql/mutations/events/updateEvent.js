import gql from 'graphql-tag';

export const REQUEST_UPDATE_EVENT = gql`
  mutation updateEvent(
    $id: ID!
    $title: String!
    $description: String
    $start_date_time: DateTime!
    $end_date_time: DateTime!
    $color: String
    $recurrence: String
    $location: String
    $participants_id: String
    $reminder: String!
  ) {
    updateEvent(
      input: {
        id: $id
        title: $title
        description: $description
        start_date_time: $start_date_time
        end_date_time: $end_date_time
        color: $color
        recurrence: $recurrence
        location: $location
        participants_id: $participants_id
        reminder: $reminder
      }
    ) {
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
