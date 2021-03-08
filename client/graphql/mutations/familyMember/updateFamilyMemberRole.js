import gql from 'graphql-tag';

export const REQUEST_UPDATE_FAMILY_MEMBER_ROLE = gql`
  mutation updateFamilyMemberRole($id: ID!, $role: String!) {
    updateFamilyMemberRole(input: {id: $id, role: $role}) {
      id
      family {
        id
        name
        familyMember {
          id
        }
      }
      role
    }
  }
`;
