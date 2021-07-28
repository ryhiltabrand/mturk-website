import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import AWS from "aws-sdk";
export default class AddAssignments extends Component {
    state={ name: null }

    addAssignments(hitId, amount) {
        AWS.config.update({
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
          region: "us-east-1",
          endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
        });
    
        const mturk = new AWS.MTurk();
    
        var params = {
          HITId: hitId,
          NumberOfAdditionalAssignments: amount,
        };
    
        mturk.createAdditionalAssignmentsForHIT(params, function (err, data) {
          if (err) console.log(err, err.stack);
          // an error occurred
          else console.log(data); // successful response
        });
      }

  handleChange = (e) => {
    const target = e.target;
    let name = target.name;
    let value = target.value;

  this.setState({
    [name]: value,
  });
}
   
    handleSubmitAssign = (e) =>{
            //e.preventDefault();
            
            console.log(this.state.NumberOfAdditionalAssignments)
            console.log(e)

            this.addAssignments(e, this.state.NumberOfAdditionalAssignments)
            
    };

  render(){
      console.log(this.props.hit)
      
       
    return(
      <Modal 
        show={this.props.isOpen} 
        onHide={this.props.closeModal}
        centered
      >
      <Modal.Header closeButton>
        <Modal.Title>Add Assignments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={this.handleSubmit}>
      <label>
            How Many Assignments Would you like to add? <br />
            <input
              name="NumberOfAdditionalAssignments"
              type="number"
              required
              checked={this.state.NumberOfAdditionalAssignments}
              onChange={this.handleChange}
            />
          </label>{" "}
          <br />
        </form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="primary" type="submit" onClick={() => this.handleSubmit(this.props.hit)}>
              Submit
          </Button>
      </Modal.Footer>
    </Modal>
    )
  }
   
  }
  