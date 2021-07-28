import React, { Component } from "react";
import "./App.css";
import Amplify, { Auth } from "aws-amplify";
import { NavLink, Switch, Route, BrowserRouter } from "react-router-dom";
import { Logins, Logins2 } from "./components/login/index";
import ProtectedRoute from "./components/login/protectedRoute";
import { SignOut } from "aws-amplify-react";
import { Home, Hits } from "./components/pages/pages";
import SignIn from "./components/login/signIn";

class App extends Component {
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
      .then((user) => console.log(1))
      .catch((err) => console.log(err));
    if (this.state.authStatus === true) {
      return (
        <div className="app">
          <h1>O.D.U. AWSMTURK DEMO</h1>
          <BrowserRouter forceRefresh={true}>
            <ProtectedRoute />
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <div className="app">
          <h1>O.D.U. AWSMTURK DEMO</h1>
          <BrowserRouter forceRefresh={true}>
            <Main />
          </BrowserRouter>
        </div>
      );
    }
  }
}
const PNavigation = () => (
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
        <NavLink exact activeClassName="current" to="/Upload">
          Upload
        </NavLink>{" "}
      </li>

      <SignIn />
    </ul>
  </nav>
);
const UPNavigation = () => (
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

      <SignIn />
    </ul>
  </nav>
);

const Main = () => {
  return (
    <div>
      <UPNavigation />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/Hits" component={Hits} />
        
      </Switch>
    </div>
  );
};

export default App;
