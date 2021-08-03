import React, { Component } from "react";
import "./App.css";
import { Auth,Hub  } from "aws-amplify";
import { NavLink, Switch, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/login/protectedRoute";
import { Home, Hits } from "./components/pages/pages";
import SignIn from "./components/login/signIn";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      authStatus: false,  //sets login 
    };
    this.listener = this.listener.bind(this);
  }
  componentDidMount() {
    Hub.listen('auth', this.listener);

    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({ authStatus: true });
      })
      .catch(() => {
      });
  }
  
  listener = (data) => {
    switch (data.payload.event) {
        case 'signIn':
            this.setState({authStatus: true });
            break;
        case 'signOut':
            this.setState({ authStatus: false });
            break;
        default:
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
