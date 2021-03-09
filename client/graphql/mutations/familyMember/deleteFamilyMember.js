import gql from 'graphql-tag';

export const REQUEST_DELETE_FAMILY_MEMBER = gql`
  mutation deleteFamilyMember($id: ID!) {
    deleteFamilyMember(id: $id) {
      id
    }
  }
`;