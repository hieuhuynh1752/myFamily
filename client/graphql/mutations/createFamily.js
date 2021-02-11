import gql from 'graphql-tag';

export const REQUEST_CREATE_FAMILY = gql`
  mutation createFamily($name: String!) {
    createFamily(input: {name: $name}) {
      id
      name
    }
  }
`;

export const REQUEST_CREATE_FAMILY_MEMBER = gql`
  mutation createFamilyMember($userid: ID!, $familyid: ID!, $role: String!){
      createFamilyMember(input:{
          user:{connect: $userid},
          family:{connect: $familyid},
          role: $role
      }){
          id
          family{
              id
              name
          }
          role
      }
  }
`;
