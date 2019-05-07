import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {addLikeToLyric} from '../../graphql/mutation';

class LyricList extends Component {
  addLikes = (id, likes) => {
    this.props.mutate({
      variables:{id},
      optimisticResponse:{
        __typename:'Mutation',
        likeLyric: {
          __typename: "Lyric",
          id,
          likes: likes + 1
        }
      }
    })
  }

  renderLyricItem = () => {
    return this.props.lyrics.map(({id, content, likes}) => {
      return (
        <li key={id} className='collection-item'>
          {content}
          <div className='vote'>
            <i className='material-icons' onClick={() => this.addLikes(id, likes)}>thumb_up</i>
            <span>{likes}</span>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className='collection'>
        {this.renderLyricItem()}
      </ul>
    );
  }
}

export default graphql(addLikeToLyric)(LyricList);