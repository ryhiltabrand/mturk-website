import React, { Component } from "react";
import "./App.css";
import { Auth,Hub,Logger  } from "aws-amplify";
import { NavLink, Switch, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/login/protectedRoute";
import { Home, Hits } from "./components/pages/pages";
import SignIn from "./components/login/signIn";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      authStatus: false,
      loading: false,
      auth: false
    };
    this.listener = this.listener.bind(this);
  }
  componentDidMount() {
    Hub.listen('auth', this.listener);
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({ loading: false, authStatus: true });
        console.log(user);
      })
      .catch(() => {
        this.setState({ loading: false });
        //this.props.history.push('/LogIn');
      });
  }
  logger = new Logger('My-Logger');
  listener = (data) => {
    switch (data.payload.event) {
        case 'signIn':
            console.log("signed in")
            this.setState({ loading: false, authStatus: true });
            break;
        case 'signOut':
          console.log("signed out")
            this.setState({ authStatus: false });
            break;
    }
}
  changeAuthState = (dataType) => {
    this.setState({
     dataType: dataType
    });
   }
  render() {
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
    
          <SignIn changeAuthState={this.changeAuthState} />
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
    /*Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => console.log(user))
      .catch((err) => console.log(err));*/
    if (this.state.authStatus === true) {
      return (
        <div className="app">
          
          <h1>O.D.U. AWSMTURK DEMO</h1>
          <BrowserRouter forceRefresh={false}>
            <ProtectedRoute />
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <div className="app">
          
          <h1>O.D.U. AWSMTURK DEMO</h1>
          <BrowserRouter forceRefresh={false}>
            <Main />
          </BrowserRouter>
        </div>
      );
    }
  }
}

export default App;
