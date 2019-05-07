import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import SongList from './component/songList/SongList';
import SongCreate from './component/songCreate/SongCreate';
import SongDetail from './component/songDetail/SongDetail';
import Header from './component/header/Header';
import Signup from './component/signup/Signup';
import Login from './component/login/Login';
import requireAuth from './component/requireAuth/RequireAuth';

class App extends Component {
  render() {
    return (
      <div className='container'>
        <Header/>
        <Switch>
          <Route path='/song/new' component={requireAuth(SongCreate)}/>
          <Route path='/song/:id' component={requireAuth(SongDetail)}/>
          <Route path='/signup' component={requireAuth(Signup)}/>
          <Route path='/login' component={requireAuth(Login)}/>
          <Route path='/' exact component={requireAuth(SongList)}/>
        </Switch>
      </div>
    );
  }
}

export default App;