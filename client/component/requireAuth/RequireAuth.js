import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {authUser} from '../../graphql/query';
//hoc component
//auth component

export default (WrappedComponent) => {
  class RequireAuth extends Component {
    componentWillUpdate(nextProps) {
      const {data: {user}, location: {pathname}} = nextProps;
      if (!user) {
        if (pathname !== '/signup' && pathname !== '/login') {
          this.props.history.push('/login');
        }
      } else {
        if (pathname === '/login' || pathname === '/signup') {
          this.props.history.push('/');
        }
      }
    }

    render() {
      if (this.props.data.loading) {
        return <div>Loading...</div>;
      }
      return <WrappedComponent {...this.props}/>;
    }
  }

  return graphql(authUser)(RequireAuth);
}


