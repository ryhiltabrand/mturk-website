import React, { Component } from "react";

import ListHits from "../getturk";
import S3upload from "../uploads3";
import AddHit from "../addhit";
import mturk from "../mturk";
import Manage from "../managehits";

export function Home() {
  return (
    <div className="home">
      <h1>Welcome to my demo MTURK website</h1>
      <p> Work in Progress</p>
    </div>
  );
}

export class Hits extends Component {
  render() {
    return (
      <div className="hits">
        <ListHits />
      </div>
    );
  }
}

export class HitAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      maxAssignments: 0,
      lifeTimeInSeconds: 0,
      assignmentDurationInSeconds: 0,
      rewardInCents: 0.0,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleInputChange(event) {
    const target = event.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  }
  handleSubmit = (event) => {
    const ahit = new AddHit();
    const s3 = new S3upload();
    event.preventDefault();
    alert(
      "you have inputed \n" +
        "Title: " +
        this.state.title +
        "\nDescription: " +
        this.state.description +
        "\nMax Assignments: " +
        this.state.maxAssignments +
        "\nLifetime In Seconds: " +
        this.state.lifeTimeInSeconds +
        "\nAssignment Duration In Seconds: " +
        this.state.assignmentDurationInSeconds +
        "\nReward: " +
        this.state.rewardInCents
    );
    ahit.CreateHit(
      this.state.title,
      this.state.description,
      this.state.maxAssignments,
      this.state.lifeTimeInSeconds,
      this.state.assignmentDurationInSeconds,
      this.state.rewardInCents,
      this.fileInput.current.files[0].name
    );
    s3.upload(this.fileInput.current.files[0]);
    //`\n Selected File -${this.fileInput.current.files[0].name}`
  };

  render() {
    const ahit = new AddHit();
    function creator() {
      ahit.CreateHit();
    }
    return (
      <div className="HitAdder">
        <h1>Add a Hit</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Title: <br />
            <input
              name="title"
              type="text"
              required
              checked={this.state.title}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Description: <br />
            <input
              name="description"
              type="text"
              required
              checked={this.state.description}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Max Assignments: <br />
            <input
              name="maxAssignments"
              type="number"
              required
              checked={this.state.maxAssignments}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Lifetime In Seconds: <br />
            <input
              name="lifeTimeInSeconds"
              type="number"
              required
              checked={this.state.lifeTimeInSeconds}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Assignment Duration In Seconds: <br />
            <input
              name="assignmentDurationInSeconds"
              type="number"
              required
              checked={this.state.assignmentDurationInSeconds}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Reward In Cents(write 0.00 form): <br />
            <input
              name="rewardInCents"
              type="text"
              required
              checked={this.state.rewardInCents}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Image to be Uploaded <br />
            <input name="file" type="file" ref={this.fileInput} />
          </label>{" "}
          <br />
          <input type="submit" />
        </form>
        {/*<button onClick={creator}>Create Your Hit</button>*/}
      </div>
    );
  }
}

export class Balance extends Component {
  render() {
    const MTURK = new mturk();

    return (
      <div className="balance">
        <h1>Balance</h1>
        <div id="output"></div>
        <script>{MTURK.getAccountBalance()}</script>
      </div>
    );
  }
}

export class ManageAssignments extends Component {
  render() {
    return (
      <div className="manage">
        <h1>Mangage your hits</h1>
        <Manage />
      </div>
    );
  }
}
