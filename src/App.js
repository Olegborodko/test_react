import React, {Component} from 'react';
import './scss/index.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Login from './components/Login';
import Page404 from './components/Page404';
import Products from './components/Products';


class App extends Component {
  componentDidMount() {
    let token = localStorage.getItem('token');

    if (!token && window.location.pathname !== '/'){
      window.location.pathname = '/';
    }
  }

  render(){
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Login/>
          </Route>
          <Route exact path="/products">
            <Products/>
          </Route>
          <Route path="*">
            <Page404/>
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
