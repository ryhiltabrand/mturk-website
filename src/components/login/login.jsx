import React, { Component } from "react";
import { Authenticator, Greetings, SignIn} from "aws-amplify-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";


export class Logins extends Component {
  render() {
    return (
      <div>
        <Authenticator hideDefault={true}>
          <SignIn />
          <Greetings
            inGreeting={(username) => "Hello " + username}
            outGreeting="Please sign in"
          />
        </Authenticator>
        {/*refreshPage()*/}
      </div>
    );
  }
}

export class Logins2 extends Component {
  handleChange = (e) => {
    const target = e.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  };
  handleSubmitAssign = (e) => {
    //e.preventDefault();

    console.log(e);

  };

  changeAuth = (e) => {
   
       var type = e;
       this.props.changeAuthState(type); // call it here with this.props!!
    }
  
  
  render() {
    
    return (
      <Modal show={this.props.isOpen} onHide={this.props.closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Authenticator hideDefault={true}>
            <SignIn/>
            <Greetings
              inGreeting={(username) => "Hello " + username}
            />
          </Authenticator>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    );
  }
}

export class Logins3 extends Component {
  handleChange = (e) => {
    const target = e.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  };
  handleSubmitAssign = (e) => {
    //e.preventDefault();

    console.log(e);

  };

  changeAuth = (e) => {
   
       var type = e;
       this.props.changeAuthState(type); // call it here with this.props!!
    }
  
  
  render() {
    
    return (
      <Modal show={this.props.isOpen} onHide={this.props.closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Authenticator hideDefault={true} onStateChange={this.changeAuth}>
            <SignIn/>
            <Greetings
              inGreeting={(username) => "Hello " + username}
              outGreeting="Please sign in"
            />
          </Authenticator>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    );
  }
}