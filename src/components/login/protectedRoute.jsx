import Amplify, { Auth} from "aws-amplify";
import {Switch, Route, NavLink} from "react-router-dom";
import awsExports from "../../aws-exports";
import React, {Component} from "react";
import SignIn from "./signIn";
import { Home, Hits } from "../pages/pages";


import {
  Balance,
  HitAdder,
  ManageAssignments,
  UploadImages
} from "../pages/pages";


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
      .then((user) => console.log(1))
      .catch((err) => console.log(err));
    if (this.state.authStatus === true) {
      return (
        <div>
          <Navigation/>
          <Switch>
          <Route exact path="/" component={Home} />
        <Route exact path="/Hits" component={Hits} />
            <Route exact path="/HitAdder" component={HitAdder} />
            <Route exact path="/Balance" component={Balance} />
            <Route exact path="/Manage" component={ManageAssignments} />
            <Route exact path="/Upload" component={UploadImages} />
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

/*export default AmplifyAuthenticator(Protected, {
    usernameAttributes: 'email'
  });*/
export default Protected;
