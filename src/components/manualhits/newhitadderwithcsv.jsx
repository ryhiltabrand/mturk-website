var AWS = require("aws-sdk");
var router = require("react-router-dom");
var react = require("react");

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const { resolve } = require("path");
const { promises } = require("stream");

function CreateHit(
  fileName,
  path,
  caption,
  inline_refrence,
  assignments,
  lifetime,
  duration,
  reward
) {
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
    endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com/",
  });
  const mTurkClient = new AWS.MTurk();

  var desc = `Please check the figure(${fileName}) and answer the following questions`;

  var xml = `<HTMLQuestion  xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd">
            <HTMLContent><![CDATA[
                <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
                <script type='text/javascript' src='https://s3.amazonaws.com/mturk-public/externalHIT_v1.js'></script>
            </head>
            <body>
                <form name='mturk_form' method='post' id='mturk_form' action='https://workersandbox.mturk.com/mturk/externalSubmit'>
                <input type='hidden' value='' name='assignmentId' id='assignmentId'/>
                <h1>Question for ${fileName} </h1>
                <b>Figure: </b>
                <img src="https://figures-odu-examples-6-27-2021.s3.amazonaws.com/${path}/${fileName}" alt="alternatetext">
                <p><b>Label: </b>${caption}</p>
                <p><b>InLine Refrences: </b>${inline_refrence}</p>

                
                <fieldset id= "div1" required>
                <label for= 'question1'> 1. Is this current content component a scientific figure or a table?</label><br>
                <select name = "question1" id = "question1" required>
                <option disabled selected value>Select an option</option>
                <option id="figure">Figure</option>
                <option id="table">Table</option>
                </select>
                <button onclick="myFunction()">confirm</button>
                <br>
                <br>
                
                
                <label for= 'question2'> 2. Is this current content component cropped correctly?</label><br>
                <select name = "question2" id = "question2" required>
                <option disabled selected value>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
                <br>
                <br>
                

                <label for= 'question3-4'> 3-4. Is this <a id = 'name'></a> labeled correctly?</label><br>
                <script>
                    function myFunction(){
                        if (document.getElementById("figure").selected){
                            name = "figure";
                        } else if(document.getElementById("table").selected){
                            name = "table";
                        } else{
                            name = "[CONFIRM QUESTION 1]"
                        }
                        document.getElementById("name").innerHTML = name;
                }
                </script>
                <select name = "question3-4" id = "question3-4" required>
                <option disabled selected value>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
                <br>
                <br>

                <label for= 'question5'> 5. What are the <b>explicit</b> meta-tags of this current content component </label><br>
                <input name = "question5" id = "question5" required></input>
                <br>
                <br>

                <label for= 'question6'> 6. What are the <b>implicit</b> meta-tags of this current content component </label><br>
                <input name = "question6" id = "question6" required></input>
                <br>
                <br>
                
                <p><input type='submit' id='submitButton' value='Submit' /></p></form>

                </fieldset>

                <script language='Javascript'>turkSetAssignmentID();</script>
            </body>
            </html>
            ]]>
            </HTMLContent>
                <FrameHeight>750</FrameHeight>
            </HTMLQuestion >`;

  if (
    fileName === undefined ||
    desc === undefined ||
    assignments === undefined ||
    lifetime === undefined ||
    duration === undefined ||
    reward === undefined
  ) {
    console.log("You did not fill out all fields or confirm your selection");
  } else {
    var myHIT = {
      Title: fileName,
      Description: desc,
      MaxAssignments: assignments,
      LifetimeInSeconds: lifetime,
      AssignmentDurationInSeconds: duration,
      Reward: reward,
      Question: xml,
      // Add a qualification requirement that the Worker must be either in Canada or the US
    };
  }

  mTurkClient.createHIT(myHIT, function (err, data) {
    //console.log(myHIT)
    if (err) {
      console.log("hi");
      console.log(err.message);
    } else {
      console.log(data);
      // Save the HITId printed by data.HIT.HITId and use it in the RetrieveAndApproveResults.js code sample
      console.log(
        "HIT has been successfully published here: https://workersandbox.mturk.com/mturk/preview?groupId=" +
          data.HIT.HITTypeId +
          " with this HITId: " +
          data.HIT.HITId
      );
    }
  });
}

var queryParameter = () =>
  new Promise((resolve) => {
    let returnLit = [];
    csv
      .parseFile("./scientific_figures.csv", { headers: true })
      .on("data", (data) => {
        sci_fig = data["sci_fig"];
        caption = data["caption"];
        inline_reference = data["inline_reference"];
        metadata = data["metadata"];
        label = data["label"];
        console.log(sci_fig);
        console.log(caption);
        console.log(inline_reference);
        console.log(metadata);
        console.log(label);
        console.log("breaks");
        CreateHit(
          sci_fig,
          label,
          caption,
          inline_reference,
          15,
          86400,
          3600,
          "0.10"
        );
        //returnLit.push(data)
      })
      .on("end", () => {
        resolve(returnLit);
      });
  });

queryParameter();

//CreateHit(arch, 15, 86400, 3600, "0.10")
