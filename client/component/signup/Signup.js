import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {signup} from '../../graphql/mutation';
import {authUser} from "../../graphql/query";
import AuthForm from '../authForm/AuthForm';

class Signup extends Component {
  state = {
    errors: []
  }

  onSignup = ({email, password}) => {
    this.props.mutate({
      variables: {email, password},
      refetchQueries: [{query: authUser}]
    }).then(() => {
      this.props.history.push('/');
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({errors});
    });
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h3>Signup</h3>
        <AuthForm btnName='Signup' onSubmit={this.onSignup} errors={this.state.errors}/>
      </div>
    );
  }
}

export default graphql(authUser)(graphql(signup)(Signup));