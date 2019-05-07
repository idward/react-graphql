import gql from 'graphql-tag';

export const fetchSongs = gql`
  {
    songs {
      id
      title
    }
  }
`;

export const fetchSong = gql`
  query FetchSong($id:ID!){
    song(id:$id){
      id
      title
      lyrics {
        id
        content
        likes
      }
    }
  }
`;

export const authUser = gql`
  {
    user {
      id
      email
    }
  }
`;