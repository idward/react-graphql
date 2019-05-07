import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {graphql} from 'react-apollo';

import {fetchSongs} from '../../graphql/query';
import {deleteSong} from '../../graphql/mutation';

class SongList extends Component {
  deleteSong = (id) => {
    this.props.mutate({
      variables:{id}
    }).then(() => this.props.data.refetch());
  }

  renderSongs = () => {
    return this.props.data.songs.map(({id, title}) => {
      return (
        <li className='collection-item' key={id}>
          <Link to={`/song/${id}`}>{title}</Link>
          <i className='material-icons' onClick={() => this.deleteSong(id)}>delete</i>
        </li>
      );
    });
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <ul className='collection'>
          {this.renderSongs()}
        </ul>
        <Link to='/song/new' className='btn-floating btn-large red right'>
          <i className='material-icons'>add</i>
        </Link>
      </div>
    );
  }
}

export default graphql(deleteSong)(graphql(fetchSongs)(SongList));