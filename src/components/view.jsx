import React, { Component } from "react";
//import logo from './logo.svg';
//import ReactDOM from 'react-dom';
//import AWS from "aws-sdk";
//import ReactTable from "react-table";
//import 'react-table/react-table.css';
//import xml2js from "xml2js";
import "./App.css";
//import "./nav.css";
//import { render } from "@testing-library/react";
//import util from 'util';
import AWS from 'aws-sdk';
//import { GetAccountBalanceCommand } from "@aws-sdk/client-mturk";
//var mturk = require('api-mturk');

var xml = `<HTMLQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd">
    <HTMLContent><![CDATA[
      <!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
        <script type='text/javascript' src='https://s3.amazonaws.com/mturk-public/externalHIT_v1.js'></script>
      </head>
      <body>
        <form name='mturk_form' method='post' id='mturk_form' action='https://www.mturk.com/mturk/externalSubmit'>
        <input type='hidden' value='' name='assignmentId' id='assignmentId'/>
        <h1>This is a test question</h1>
        <img src="https://figures-odu-examples-6-27-2021.s3.amazonaws.com/algorithms/C02-1014.pdf-Figure1.png" alt="alternatetext"> 
        <p><textarea name='comment' cols='80' rows='3'></textarea></p>
        <p><input type='submit' id='submitButton' value='Submit' /></p></form>
        <script language='Javascript'>turkSetAssignmentID();</script>
      </body>
      </html>
      ]]>
      </HTMLContent>
        <FrameHeight>450</FrameHeight>
    </HTMLQuestion>`
                    
  // Construct the HIT object below
  var myHIT = {
      Title: 'Ryan',
      Description: 'Test',
      MaxAssignments: 10,
      LifetimeInSeconds: 100000,
      AssignmentDurationInSeconds: 600,
      Reward: '0.20',
      Question: xml,

      // Add a qualification requirement that the Worker must be either in Canada or the US 
      
  };

  // Publish the object created above

AWS.config = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "us-east-1",
  endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
}

var mturk = new AWS.MTurk();

mturk.createHIT(myHIT, function (err, data) {
  if (err) {
      console.log(err.message);
  } else {
      console.log(data);
      // Save the HITId printed by data.HIT.HITId and use it in the RetrieveAndApproveResults.js code sample
      console.log('HIT has been successfully published here: https://workersandbox.mturk.com/mturk/preview?groupId=' + data.HIT.HITTypeId + ' with this HITId: ' + data.HIT.HITId);
  }
})

/*mturk.getAccountBalance({}, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});*/

var params = {
  MaxResults: '100'
};
mturk.listHITs(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

/*var paramsLA = {
  HITId: '32JRJ3GOZHN70UMLA1HGKWU5CKBU1L',
  AssignmentStatuses: [
    'Submitted' , 'Approved' , 'Rejected',
    
  ],
};
mturk.listAssignmentsForHIT(paramsLA, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});*/



class App extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);  
  }



  handleFormSubmit() {
    const urlParams = new URLSearchParams(window.location.search)
    document.getElementById('inputAssignmentId').value = urlParams.get('assignmentId')
    document.getElementById('mturk_form').submit()
  }

  handleClick() {
    console.log('Click happened');
  }

  handleChange(event) {    
    this.setState({value: event.target.value});  
  }
  handleSubmit() {
    var url = 'https://workersandbox.mturk.com/mturk/preview?groupId='+this.state.value;
    window.location.href = url;
    window.open(url, 'MsgWindow', 'width=800,height=600');
    console.log(url);
  }
  

  render() {

    var question = 'Who made the iphone'
    var xml = `<HTMLQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd">
    <HTMLContent><![CDATA[
      <!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
        <script type='text/javascript' src='https://s3.amazonaws.com/mturk-public/externalHIT_v1.js'></script>
      </head>
      <body>
        <form name='mturk_form' method='post' id='mturk_form' action='https://www.mturk.com/mturk/externalSubmit'>
        <input type='hidden' value='' name='assignmentId' id='assignmentId'/>
        <h1>This is a test question</h1>
        <p><textarea name='comment' cols='80' rows='3'></textarea></p>
        <p><input type='submit' id='submitButton' value='Submit' /></p></form>
        <script language='Javascript'>turkSetAssignmentID();</script>
      </body>
      </html>
      ]]>
      </HTMLContent>
        <FrameHeight>450</FrameHeight>
    </HTMLQuestion>`

    return(
      <div className="App">
        <head>
          <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
        </head>
        <body>
          {/*<button onClick={() => this.handleFormSubmit()}>Click Me</button>
          <form method='post' id='mturk_form' action='https://workersandbox.mturk.com/mturk/externalSubmit'>*/}
          {/*<form onSubmit={this.handleSubmit} action="">
            <label>
              GroupID:
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="send" />
          </form>*/}
          <form action="https://workersandbox.mturk.com/mturk/externalSubmit" id="mturk_form" method="post" name="mturk_form">
            <input id="assignmentId" name="assignmentId" type="hidden" value="" />

            <h1>{question}</h1>
            <p><textarea cols="80" name="answer" rows="3"></textarea></p>
            <p><input id="submitButton" type="submit" value="Submit"/></p>
          </form> 
          
          </body>

      </div>);
  }}

/*
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mturkAccountBalance: null,
      mturkHits: []
    }
  }

  componentDidMount() {
    this.getAccountBalance();
    this.getMTurkHITs();
  }
  
  getAccountBalance() {
    AWS.config.update({
      accessKeyId: "",
      secretAccessKey: "",
      region: "us-east-1",
      "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
    });
  
    const mTurkClient = new AWS.MTurk();
    mTurkClient.getAccountBalance((err, data) => {
    if (err) {
      console.warn("Error making the mTurk API call:", err);
    } else {
      // The call was a success
      const balance = `$${data.AvailableBalance}`;
      this.setState({ mturkAccountBalance: balance });
    }
    })
  }

  getMTurkHITs() {
    AWS.config.update({
      "accessKeyId": "",
      "secretAccessKey": "",
      "region": "us-east-1"
    });
   
    const mTurkClient = new AWS.MTurk();
    mTurkClient.listHITs((err, data) => {
    if (err) {
      console.warn("Error making the mTurk API call:", err);
    } else {
      // The call was a success
      const hits = data.HITs;
      this.setState({ mturkHITs: hits });
    }
   })
 }


  render() {
    var accountBalanceToDisplay = "loading...";
    if (this.state.mturkAccountBalance != null) { 
      accountBalanceToDisplay = this.state.mturkAccountBalance
    }
    return(
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to my MTurk application</h1>
      </header>
      <p className="App-intro">
        Your MTurk Requester account balance is {accountBalanceToDisplay}
        
        You have {this.state.mturkHITs.length} HIT(s).
      </p>
    </div>
  );
      
  }
}*/

export default App;
