import React, { Component } from "react";
import "react-table-6/react-table.css";
import Button from "react-bootstrap/Button";
import { Logins2 } from "./login";
import OverlayTrigger from "react-bootstrap"

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mturkHITs: [],
      ID: "",
      hit: {},
      assignmentsForCurrentHIT: [],

      LogisOpen: false,
    };

  }

  openLog = () => this.setState({ LogisOpen: true });
  closeLog = () => this.setState({ LogisOpen: false });
 

  handleInputChange(event) {
    const target = event.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.grabHit(this.state.ID);
  };

  render() {
    return (
      <div>
        <Button onClick={this.openLog} position= "center">Login/SignOut</Button>
        
        {this.state.LogisOpen ? (
          <Logins2
            closeModal={this.closeLog} 
            isOpen={this.state.LogisOpen} 
          />
        ) : null}
        </div>
        );
  }
}

export default SignIn;
