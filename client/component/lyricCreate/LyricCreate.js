import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {graphql} from 'react-apollo';
import {addLyric} from '../../graphql/mutation';
import {fetchSong} from '../../graphql/query';

class LyricCreate extends Component {
  renderComponent = ({label, input}) => {
    return (
      <div>
        <label>{label}</label>
        <input type="text" {...input}/>
      </div>
    );
  }

  onSubmit = ({content}) => {
    const {songId} = this.props;
    this.props.mutate({
      variables: {content, songId}
    }).then(() => {
      this.props.reset();
    });
  }

  render() {
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Field name='content' component={this.renderComponent} label='Add a lyric'/>
        <button type='submit'>Submit</button>
      </form>
    );
  }
}

export default graphql(addLyric)(reduxForm({
  form: 'LyricCreate'
})(LyricCreate));