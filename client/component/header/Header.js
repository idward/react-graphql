import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {graphql} from 'react-apollo';
import {authUser} from '../../graphql/query';
import {logout} from '../../graphql/mutation';

class Header extends Component {
  onLogout = () => {
    this.props.mutate({})
      .then(() => {
        this.props.data.refetch();
      });
  }

  render() {
    const {loading, user} = this.props.data;
    return (
      <div>
        <nav>
          <div className="nav-wrapper container">
            <Link to='/' id="logo-container" className="brand-logo">Logo</Link>
            <ul className="right hide-on-med-and-down">
              {(!loading && !user) && (<>
                  <li><Link to='/signup'>Sign up</Link></li>
                  <li><Link to='/login'>Login</Link></li>
                </>
              )}
              {(!loading && user) && (
                <li><a onClick={this.onLogout}>Log out</a></li>
              )}
              {loading && (
                <li></li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default graphql(logout)(graphql(authUser)(Header));