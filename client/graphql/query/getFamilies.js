import gql from 'graphql-tag'

export const REQUEST_GET_FAMILIES = gql`
query families($userid: Mixed){
    families(where:{column: USER_ID,operator:EQ,value:$userid}){
      id,
      family{
        id,
        name
      },
      role
    }
  }
`