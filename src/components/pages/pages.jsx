import React, { Component } from "react";

import ListHits from "../getturk";
import S3upload from "../uploads3";

import AddHit from "../addHitCSV"

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
  render() {
    return (
     <div className="adder">
       <AddHit />
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
