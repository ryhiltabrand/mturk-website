import React, { Component } from "react";
import { Authenticator, Greetings, SignIn } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

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
