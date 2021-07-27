import React, { Component } from "react";
import S3 from "react-aws-s3";

class S3upload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  upload(fileInput) {
    console.log(fileInput.name);
    var file = fileInput;
    var newFileName = fileInput.name;

    const BUCKET_NAME = "custom-figures-odu-examples";

    const config = {
      bucketName: "figures-odu-examples-6-27-2021",
      region: "us-east-1",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    };
    //console.log(config)
    const ReactS3Client = new S3(config);

    ReactS3Client.uploadFile(file, newFileName)
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
    /*ReactS3Client.uploadFile(file, newFileName).then(data => {
            console.log(config)
            console.log(data);
            if (data.status === 204) {
              console.log("success");
            } else {
              console.log("fail");
            }
          });*/

    /*const params = {
            Bucket: BUCKET_NAME,
            Key: fileInput.name,
            Body: fileInput
        };

        s3.upload(params, function(err, data){
            if (err) {
                console.log(err);
            }
            console.log(`File upload to: ${data.Location}`)
        });*/
  }
}

export default S3upload;
