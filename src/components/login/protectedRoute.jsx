import Amplify, { Auth, signInButtonContent } from "aws-amplify";
import { NavLink, Switch, Route, Redirect, HashRouter } from "react-router-dom";
import awsExports from "../../aws-exports";
import React, { Component, useEffect, useState } from "react";

import {
  withAuthenticator,
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignIn,
  AmplifyAuthContainer,
} from "@aws-amplify/ui-react";
import { SignOut, SignIn, Authenticator, Greetings } from "aws-amplify-react";

import {
  Home,
  Balance,
  Hits,
  HitAdder,
  ManageAssignments,
} from "../pages/pages";
import Manage from "../managehits";

Amplify.configure(awsExports);
class Protected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authStatus: false,
      loading: false,
    };
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({ loading: false, authStatus: true });
      })
      .catch(() => {
        this.setState({ loading: false });
        //this.props.history.push('/LogIn');
      });
  }

  render() {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => console.log(user))
      .catch((err) => console.log(err));
    if (this.state.authStatus === true) {
      return (
        <div>
          <Switch>
            <Route exact path="/HitAdder" component={HitAdder} />
            <Route exact path="/Balance" component={Balance} />
            <Route exact path="/Manage" component={ManageAssignments} />
          </Switch>
        </div>
      );
    } else {
      return null;
    }

    /*return (
      <div>
      <Switch>
      <Route exact path='/HitAdder' component={HitAdder}/>
      <Route exact path='/Balance' component={Balance}/>
      <Route exact path='/Manage' component={ManageAssignments}/>
      </Switch>
      </div>
    )*/
  }
}

const Navigation = () => (
  <nav>
    <ul>
      <li>
        <NavLink exact activeClassName="current" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/Hits">
          Hits
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/HitAdder">
          Add Hit
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/Balance">
          Balance
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/LogIn">
          LogIn
        </NavLink>
      </li>
      <SignOut />
    </ul>
  </nav>
);

/*export default AmplifyAuthenticator(Protected, {
    usernameAttributes: 'email'
  });*/
export default Protected;
