import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {graphql} from 'react-apollo';
import {fetchSong} from '../../graphql/query';

import LyricCreate from '../lyricCreate/LyricCreate';
import LyricList from '../lyricList/LyricList';

class SongDetail extends Component {
  render() {
    const {song} = this.props.data;

    if (!song) {
      return <div>Loading...</div>;
    }
    
    console.log(this.props);

    return (
      <div>
        <Link to='/'>Back</Link>
        <h3>{song.title}</h3>
        <LyricList lyrics={song.lyrics}/>
        <LyricCreate songId={song.id}/>
      </div>
    );
  }
}

export default graphql(fetchSong, {
  options: (props) => {
    return {variables: {id: props.match.params.id}}
  }
})(SongDetail);