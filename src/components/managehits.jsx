/**
 * @file Handles the management of hits
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import React, { Component } from "react";
import AWS from "aws-sdk";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import AddAssignments from "./ModalForms/AddAssignments";
import AddTime from "./ModalForms/AddTime";
import Button from "react-bootstrap/Button";

class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mturkHITs: [],
      ID: "",
      hit: {},
      assignmentsForCurrentHIT: [],

      AssignisOpen: false,
      TimeisOpen: false,
    };

    //Binding to this class to have the ability to change states
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.grabHit = this.grabHit.bind(this);
    this.grabAssignment = this.grabAssignment.bind(this);
    this.gethitinfo = this.gethitinfo.bind(this);
    this.dropAssignments = this.dropAssignments.bind(this);
  }

  //Opening and closing of modal form states
  openAssign = () => this.setState({ AssignisOpen: true });
  closeAssign = () => this.setState({ AssignisOpen: false });
  openTime = () => this.setState({ TimeisOpen: true });
  closeTime = () => this.setState({ TimeisOpen: false });

  componentDidMount() {
    this.getMTurkHITs();
  }

  handleInputChange(event) {
    const target = event.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  }

  getMTurkHITs() {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com", //set for sandbox, change for production
    });

    const mTurkClient = new AWS.MTurk();
    var params = {
      MaxResults: "100",
    };

    mTurkClient.listHITs(params, (err, data) => {
      if (err) console.log(err, err.stack);
      // an error occurred
      else {
        const hits = data.HITs;
        this.setState({ mturkHITs: hits });
      }
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.grabHit(this.state.ID);
  };

  /**
   * @function changes the state of which hit is selected from table
   * @param {string} hitID - ID of hit selected
   */
  grabHit(hitID) {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });
    const mTurkClient = new AWS.MTurk();
    var params = {
      HITId: hitID,
    };
    mTurkClient.getHIT(params, (err, data) => {
      if (err) console.log(err);
      else {
        const currenthit = data;
        this.setState({ hit: currenthit });
      }
    });
  }

  /**
   * @function displays the hit of current state
   */
  showHit() {
    var currentHit = this.state.hit;
    if (Object.keys(this.state.hit).length !== 0) {
      document.getElementById("output").innerHTML = Object.values(
        currentHit["HIT"]
      );
    }
  }

  /**
   * @function changes the state of which hits assignments is selected from table
   * @param {string} hitId
   */
  grabAssignment(hitId) {
    this.grabHit(hitId);
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });
    const mTurkClient = new AWS.MTurk();
    mTurkClient.listAssignmentsForHIT({ HITId: hitId }, (err, data) => {
      if (err) {
        console.warn("Error making the mTurk API call:", err);
      } else {
        // The call was a success
        const assignments = data.Assignments;
        this.setState({ assignmentsForCurrentHIT: assignments });
      }
    });
  }

  /**
   * @function changes current hit to empty
   * @param {string} hitId
   */
  dropAssignments() {
    this.setState({ hit: {} });
  }

  /**
   * @function displays the assignment of current hit state into a string
   */
  showAssignment() {
    var currentAssign = this.state.assignmentsForCurrentHIT;
    if (Object.keys(this.state.assignmentsForCurrentHIT).length !== 0) {
      let temp = "";
      for (let i = 0; i < currentAssign.length; i++) {
        temp += Object.values(currentAssign[i]);
      }
      document.getElementById("output").innerHTML = temp;
    }
  }

  /**
   * @function deletes hit by passing hit and calling mturk api
   * @param {string} hitId
   */
  deleteHit(hitId) {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });

    const mTurkClient = new AWS.MTurk();
    var params = {
      HITId: hitId,
    };
    mTurkClient.deleteHIT(params, function (err, data) {
      if (err) alert(err, err.stack);
      // an error occurred
      else alert(data); // successful response
    });
  }

  /**
   *
   * @returns Hit as an array
   */
  gethitinfo() {
    var arr = Object.values(this.state.hit);
    if (arr.length === 0) {
      return null;
    } else {
      var hit = Object.values(arr[0]);
      return hit[0];
    }
  }

  /**
   * @function Expires remaining time on a hit using mturk api
   * @param {string} hitId
   */
  expireHit(hitId) {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });

    const mTurkClient = new AWS.MTurk();

    var params = {
      ExpireAt: Date.now() / 1000, //converts current time to acceptable format
      HITId: hitId,
    };

    mTurkClient.updateExpirationForHIT(params, function (err, data) {
      if (err) alert(err, err.stack);
      // an error occurred
      else alert(data); // successful response
    });
  }

  /**
   * @function approves assignment using the mturk api
   * @param {string} assignmentId - id of a workers submitted assignment
   */
  approveAssignment(assignmentId) {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });

    const mturk = new AWS.MTurk();

    var params = {
      AssignmentId: assignmentId,
    };
    mturk.approveAssignment(params, function (err, data) {
      if (err) alert(err, err.stack);
      // an error occurred
      else alert(data); // successful response
    });
  }

  /**
   * @function rejects assignment using the mturk api
   * @param {string} assignmentId - id of a workers submitted assignment
   */
  rejectAssignment(assignmentId) {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });

    const mturk = new AWS.MTurk();

    var params = {
      AssignmentId: assignmentId,
      RequesterFeedback: "placeholder",
    };

    mturk.rejectAssignment(params, function (err, data) {
      if (err) alert(err, err.stack);
      // an error occurred
      else alert(data); // successful response
    });
  }

  render() {
    //Columns for the table for hits
    const reactTableColumns = [
      {
        Header: "HIT Group Id",
        accessor: "HITGroupId",
        Cell: (props) => (
          <a
            href={
              "https://workersandbox.mturk.com/projects/" +
              props.value +
              "/tasks"
            }
          >
            {props.value}
          </a>
        ),
      },
      {
        Header: "Title",
        accessor: "Title",
      },
      {
        Header: "Reward Amount",
        accessor: "Reward",
        Cell: (props) => <span>${props.value}</span>,
      },
      {
        Header: "Manage",
        accessor: "HITId",
        Cell: (original) => (
          <Button
            value={original.value}
            onClick={() => this.grabAssignment(original.value)}
          >
            {" "}
            Manage{" "}
          </Button>
        ),
      },
    ];

    //Columns for the table of assignments
    const AssignmentTableColumns = [
      {
        Header: "Assignmet Id",
        accessor: "AssignmentId",
        //Cell: props => <a  href={"https://workersandbox.mturk.com/projects/"+props.value+"/tasks"}>{props.value}</a>
      },
      {
        Header: "Worker",
        accessor: "WorkerId",
      },
      {
        Header: "Status",
        accessor: "AssignmentStatus",
        //Cell: props => <span>${props.value}</span>
      },
      {
        Header: "Manage",
        accessor: "AssignmentId",
        Cell: (original) => (
          <p>
            <button
              value={original.value}
              onClick={() => this.approveAssignment(original.value)}
            >
              {" "}
              Accept{" "}
            </button>
            &ensp;
            <button
              value={original.value}
              onClick={() => this.rejectAssignment(original.value)}
            >
              {" "}
              Reject{" "}
            </button>
          </p>
        ),
      },
    ];
    if (this.gethitinfo() !== null) {
      return (
        <div>
          <h1> You have {this.state.mturkHITs.length} HIT(s). </h1>

          <ReactTable
            data={this.state.mturkHITs}
            columns={reactTableColumns}
            defaultPageSize={10}
          />

          <h1>
            {" "}
            You have {this.state.assignmentsForCurrentHIT.length} Assignments
            for HIT {this.gethitinfo()}.{" "}
          </h1>
          {
            <Button
              //value={this.gethitinfo()}
              onClick={() => this.dropAssignments()}
            >
              Clear Selection
            </Button>
          }
          {
            <Button
              value={this.gethitinfo()}
              onClick={() => this.deleteHit(this.gethitinfo())}
            >
              {" "}
              Delete{" "}
            </Button>
          }
          {
            <Button
              value={this.gethitinfo()}
              onClick={() => this.expireHit(this.gethitinfo())}
            >
              {" "}
              Expire{" "}
            </Button>
          }

          <Button onClick={this.openAssign}>Add Assignments</Button>

          {this.state.AssignisOpen ? (
            <AddAssignments
              hit={this.gethitinfo()}
              closeModal={this.closeAssign}
              isOpen={this.state.AssignisOpen}
            />
          ) : null}

          <Button onClick={this.openTime}>Add Time</Button>

          {this.state.TimeisOpen ? (
            <AddTime
              hit={this.gethitinfo()}
              closeModal={this.closeTime}
              isOpen={this.state.TimeisOpen}
            />
          ) : null}

          <ReactTable
            data={this.state.assignmentsForCurrentHIT}
            columns={AssignmentTableColumns}
            defaultPageSize={5}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h1> You have {this.state.mturkHITs.length} HIT(s). </h1>

          <ReactTable
            data={this.state.mturkHITs}
            columns={reactTableColumns}
            defaultPageSize={10}
          />
        </div>
      );
    }
  }
}

export default Manage;
