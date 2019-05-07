import gql from 'graphql-tag';

export const deleteSong = gql`
  mutation DeleteSong($id:ID!){
      deleteSong(id:$id){
        id
      }
  }
`;

export const addLyric = gql`
  mutation AddLyric($songId:ID!,$content:String!){
     addLyricToSong(songId:$songId, content:$content){
        id
        lyrics {
          id
          content
          likes
        }
     }
  }
`;

export const addLikeToLyric = gql`
    mutation AddLikeToLyric($id:ID!){
        likeLyric(id:$id){
            id
            likes
            content
        }
    }
`;

export const login = gql`
  mutation Login($email:String!,$password:String!) {
    login(email:$email,password:$password){
      id,
      email
    }
  }
`;

export const signup = gql`
  mutation Signup($email:String!,$password:String!) {
    signup(email:$email,password:$password){
      id,
      email
    }
  }
`;

export const logout = gql`
  mutation {
    logout {
      id
      email
    }
  }
`;