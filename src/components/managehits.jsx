import React, { Component } from "react";
import AWS from 'aws-sdk';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import mturk from "./mturk";

class Manage extends Component {
    constructor(props) {
      super(props);
      this.state = {
      mturkHITs: [],
      ID: '',
      hit: {},
      assignmentsForCurrentHIT: []
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.grabHit = this.grabHit.bind(this);
      this.grabAssignment = this.grabAssignment.bind(this);
      this.gethitinfo = this.gethitinfo.bind(this);

      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        "region": "us-east-1",
        "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
      });
    const mTurkClient = new AWS.MTurk();
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
      //console.log(hitID)
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

    grabAssignment(hitId) {
        this.grabHit(hitId)
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

    showAssignment() {
      
      var currentAssign = this.state.assignmentsForCurrentHIT;
      if(Object.keys(this.state.assignmentsForCurrentHIT).length === 0){
        console.log('no select')
      } else {
        console.log(currentAssign)
        let temp = ''
        for(let i = 0; i <currentAssign.length; i++){
            temp += Object.values(currentAssign[i])
        }
        document.getElementById('output').innerHTML = temp
      }
    }

    deleteHit(hitId) {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            "region": "us-east-1",
            "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
          });
         
        const mTurkClient = new AWS.MTurk();
        var params = {
            HITId: hitId
        };
        mTurkClient.deleteHIT(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
    }

    gethitinfo() {
        
        var arr = Object.values(this.state.hit)
        if (arr.length === 0){
            console.log('no length')
        }else {
            var hit = Object.values(arr[0])
            //console.log(hit[0])
            return(hit[0])
        }
   
    }

    expireHit(hitId) {

        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            "region": "us-east-1",
            "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
          });
         
        const mTurkClient = new AWS.MTurk()

        var params = {
            ExpireAt: Date.now()/1000,
            HITId: hitId
        };

        mTurkClient.updateExpirationForHIT(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });

    }

    addAssignments(hitId) {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            "region": "us-east-1",
            "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
        });
         
        const mturk = new AWS.MTurk()

        var params = {
            HITId: hitId,
            NumberOfAdditionalAssignments: 1
        };

        mturk.createAdditionalAssignmentsForHIT(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });


    }

    addTime(hitId) {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            "region": "us-east-1",
            "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
        });
         
        const mturk = new AWS.MTurk()
        var addedhours = 1000;
        var params = {
            ExpireAt: Date.now()/1000+addedhours,
            HITId: hitId
        };    
    
        mturk.updateExpirationForHIT(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            });
    }

    approveAssignment(assignmentId) {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            "region": "us-east-1",
            "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
        });
         
        const mturk = new AWS.MTurk()

        var params = {
            AssignmentId: assignmentId
        }
        mturk.approveAssignment(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
    }

    rejectAssignment(assignmentId) {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            "region": "us-east-1",
            "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
        });
         
        const mturk = new AWS.MTurk()

        var params = {
            AssignmentId: assignmentId,
            RequesterFeedback: 'placeholder'
        }

        mturk.rejectAssignment(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
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
          Header: "Manage",
          accessor: 'HITId',
          Cell: original => (
            <button value={original.value} onClick={() => this.grabAssignment(original.value)}> Manage </button>
          )
        }
        ]; 
        const AssignmentTableColumns = [
            {
               Header: 'Assignmet Id',
               accessor: 'AssignmentId',
               //Cell: props => <a  href={"https://workersandbox.mturk.com/projects/"+props.value+"/tasks"}>{props.value}</a>
             }, {
               Header: 'Worker',
               accessor: 'WorkerId'
             }, {
               Header: 'Status',
               accessor: 'AssignmentStatus',
               //Cell: props => <span>${props.value}</span>
            }, {
              Header: "Manage",
              accessor: "AssignmentId",
              Cell: original => (
                      <p>
                        <button value={original.value} onClick={() => this.approveAssignment(original.value)}> Accept </button> 
                        &ensp;
                        <button value={original.value} onClick={() => this.rejectAssignment(original.value)}> Reject </button>
                      </p>
                
              )
            }]; 
  
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
        <script>{this.showAssignment()}</script>*/}
        <h1> You have {this.state.assignmentsForCurrentHIT.length} Assignments for this Hit(s). </h1>
        {console.log(this.gethitinfo())}

        
        
        {<button value={this.gethitinfo()} onClick={() => this.deleteHit(this.gethitinfo())}> Delete </button>}
        {<button value={this.gethitinfo()} onClick={() => this.expireHit(this.gethitinfo())}> Expire </button>}
        {<button value={this.gethitinfo()} onClick={() => this.addAssignments(this.gethitinfo())}> Add Assignments </button>}
        {<button value={this.gethitinfo()} onClick={() => this.addTime(this.gethitinfo())}> Add Time </button>}
        <ReactTable 
            data={this.state.assignmentsForCurrentHIT}
            columns={AssignmentTableColumns}
            defaultPageSize={5}
        />
          
          </div>
          )
  
      }   
  }
  
  export default Manage;