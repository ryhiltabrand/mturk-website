import React, { Component } from "react";
import AWS from 'aws-sdk';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

class Manage extends Component {
    constructor(props) {
      super(props);
      this.state = {
      mturkHITs: [],
      ID: '',
      hit: {},
      assignmentsForCurrentHIT: ''
      }
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
        "region": "us-east-1",
        "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
      });
     
      const mTurkClient = new AWS.MTurk();
      var params = {
        MaxResults: '100'
    };
    
      mTurkClient.listHITs(params, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred
          else{
              const hits = data.HITs;
              this.setState({ mturkHITs: hits });         
          }    
      });
    }
    handleSubmit = (event) => {
      event.preventDefault();
       this.grabHit(this.state.ID)
    }
  
    grabHit(hitID) {
      console.log(hitID)
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        "region": "us-east-1",
        "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
      });
      const mTurkClient = new AWS.MTurk();
      var params = {
        HITId: hitID
      }
      mTurkClient.getHIT(params, (err,data) =>{
        if (err) console.log(err);
        else {
            const currenthit=data;
            //console.log(currenthit);
            this.setState({hit:currenthit});
        }
      })
  
    }
  
    grabAssignment(hitId) {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
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
              console.log(assignments)
            }
          })
    }

    showHit() {
      var current='';
      var currentHit = this.state.hit;
      if(Object.keys(this.state.hit).length === 0){
        console.log('no select')
      } else {
        console.log(currentHit['HIT'])
        document.getElementById('output').innerHTML = Object.values(currentHit['HIT'])
      }
    }
  
    render() {
      const reactTableColumns = [
        {
           Header: 'HIT Group Id',
           accessor: 'HITGroupId',
           Cell: props => <a  href={"https://workersandbox.mturk.com/projects/"+props.value+"/tasks"}>{props.value}</a>
         }, {
           Header: 'Title',
           accessor: 'Title'
         }, {
           Header: 'Reward Amount',
           accessor: 'Reward',
           Cell: props => <span>${props.value}</span>
        }, {
          Header: "Attempt",
          accessor: 'HITId',
          Cell: original => (
            <button value={original.value} onClick={() => this.grabHit(original.value)}> Edit </button>
          )
        }
        ]; 
  
        return (
          <div>
          <h1> You have {this.state.mturkHITs.length} HIT(s). </h1>
          {/*console.log(this.state.mturkHITs)*/}
  
          <ReactTable 
            data={this.state.mturkHITs} 
            columns={reactTableColumns} 
            defaultPageSize={10} 
          />
          {/*console.log(this.state.hit)
          <p id="output"></p>
        <script>{this.showHit()}</script>*/}
          
          </div>
          )
  
      }   
  }
  
  export default Manage;