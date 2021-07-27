import React, { Component } from "react";
import "./App.css";
import {
  NavLink,
  Switch,
  Route,
  Router,
  BrowserRouter,
} from "react-router-dom";
import { Logins } from "./components/login/index";
import ProtectedRoute from "./components/login/protectedRoute";
import { SignOut, SignIn, Authenticator, Greetings } from "aws-amplify-react";
import Amplify, { Auth } from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Home, Balance, Hits } from "./components/pages/pages";

/*const App = () => (
  <div className='app'>
    <h1>O.D.U. AWSMTURK DEMO</h1>
    <Main />
    <ProtectedRoute />
  </div>
);*/

const federated = {};
class App extends Component {
  state = {
    authState: {
      isLoggedIn: false,
    },
  };
  render() {
    return (
      <div className="app">
        <h1>O.D.U. AWSMTURK DEMO</h1>
        <BrowserRouter forceRefresh={true}>
          <Main />
          <ProtectedRoute />
        </BrowserRouter>
      </div>
    );
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
        <NavLink exact activeClassName="current" to="/Manage">
          Manage
        </NavLink>{" "}
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

const Main = () => {
  return (
    <div>
      <Navigation />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/Hits" component={Hits} />
        <Route exact path="/LogIn" component={Logins} />
      </Switch>
    </div>
  );
};

export default App;
