import React, { Component } from "react";
import "../App.css";
import AWS from "aws-sdk";

class mturk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mturkAccountBalance: null,
    };
  }

  componentDidMount() {
    this.getAccountBalance();
  }

  getAccountBalance() {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });
    console.log("process", process.env.REACT_APP_AWS_ACCESS_KEY);
    const mTurkClient = new AWS.MTurk();
    mTurkClient.getAccountBalance((err, data) => {
      if (err) {
        console.warn("Error making the mTurk API call:", err);
        
      } else {
        // The call was a success
        const balance = `$${data.AvailableBalance}`;
        this.setState({ mturkAccountBalance: balance });
        document.getElementById("output").innerHTML =
          "Your balance is " + balance;
      }
    });
  }

  /*getAssignmentsForHIT(hitId) {
        AWS.config.update({
          "accessKeyId": "",
          "secretAccessKey": "",
          "region": "us-east-1",
          "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
        });
        
        const mTurkClient = new AWS.MTurk();
        mTurkClient.listAssignmentsForHIT({HITId: hitId}, (err, data) => {
          if (err) {
            console.warn("Error making the mTurk API call:", err);
          } else {
            // The call was a success
            const assignments = data.Assignments;
            this.setState({ assignmentsForCurrentHIT: assignments });
          }
        })
    }*/

  render() {
    return (
      <div className="App">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        </head>
        <body>Hello</body>
      </div>
    );
  }
}

export default mturk;
