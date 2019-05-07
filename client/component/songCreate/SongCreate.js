import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Field, reduxForm} from 'redux-form';

import {fetchSongs} from '../../graphql/query';

class SongCreate extends Component {
  renderComponent({label, input}) {
    return (
      <div className='aa'>
        <label>{label}</label>
        <input type="text" {...input}/>
      </div>
    );
  }

  onSubmit = ({title}) => {
    this.props.mutate({
      variables: {title},
      refetchQueries:[{query:fetchSongs}]
    }).then(() => {
      this.props.history.push('/');
    });
  }

  render() {
    const {handleSubmit} = this.props;
    return (
      <div>
        <Link to='/'>Back</Link>
        <h3>Create a new song</h3>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field name='title' component={this.renderComponent} label='Title'/>
          <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
}

const mutation = gql`
  mutation AddSong($title:String!){
     addSong(title:$title){
        id
        title
     }
  }
`;

export default graphql(mutation)(reduxForm({
  form: 'SongCreate'
})(SongCreate));