import React, { Component } from "react";
import AWS from "aws-sdk";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Button from 'react-bootstrap/Button';


class ListHits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mturkHITs: [],
      ID: "",
      hit: {},
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.grabHit = this.grabHit.bind(this);
  }
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
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
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
        //console.log(hits[0])
        //const myArray = Object.values(data.HITs[0])
        //console.log(data.HITs);
        //document.getElementById('output').innerHTML = "these are your hits "+ myArray;
        //document.getElementById('output').innerHTML = Object.values(hits[0]);
        this.setState({ mturkHITs: hits });
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.grabHit(this.state.ID);
  };

  grabHit(hitID) {
    console.log(hitID);
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
        //console.log(currenthit);
        this.setState({ hit: currenthit });
      }
    });
  }

  showHit() {
    
    var currentHit = this.state.hit;
    

    if (Object.keys(this.state.hit).length === 0) {
      console.log("no select");
    } else {
      var newarr = Object.values(currentHit["HIT"])
      console.log(currentHit["HIT"])
      console.log(newarr[6]);
      /*document.getElementById("output").innerHTML = Object.values(
        currentHit["HIT"]
      );*/
      document.getElementById("output").innerHTML = newarr[6]
      document.getElementById("output1").innerHTML =  `<a href='https://workersandbox.mturk.com/projects/${newarr[2]}/tasks' target="_"><input type="button" value="ACCEPT"/></a>`
    }
  }

  assign(b){
    
    if (b === "Assignable"){
      var status="True"
      return(<div>{status}</div>)
    } else {
       status="False"
      return(<div>{status}</div>)
    }
    
  }

  render() {
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
        Header: "Available",
        accessor: "HITStatus",
        Cell: (props) => (
          <div>
              {this.assign(props.value)}
          </div>)
        
      },
      {
        Header: "Preview",
        accessor: "HITId",
        Cell: (original) => (
          <Button
            value={original.value}
            onClick={() => this.grabHit(original.value)}
          >
            {" "}
            Preview{" "}
          </Button>
        ),
      },
    ];

    return (
      <div>
        <h1> You have {this.state.mturkHITs.length} HIT(s). </h1>
        {/*console.log(this.state.mturkHITs)*/}

        <ReactTable
        defaultSorted={[
          {
            id: "HITStatus",
            desc: false
          }
        ]}
          data={this.state.mturkHITs}
          columns={reactTableColumns}
          defaultPageSize={10}
        />
        {/*console.log(this.state.hit)*/}
        <p id="output"></p>
        <p id="output1"></p>
        <script>{this.showHit()}</script>
      </div>
    );
  }
}

export default ListHits;
