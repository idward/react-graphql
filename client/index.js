import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {Provider} from 'react-redux';
import store from './store';

import './style/main.css';
import App from './App';

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials:'same-origin'
  }),
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id || null
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
//hotload
if (module.hot) {
  module.hot.accept();
}