import React, { API, Component, useState } from "react";
import S3 from "react-aws-s3";
import Amplify, { Auth, Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);
import { Storage, StorageProvider } from 'aws-amplify';

export default class S3upload extends Component {
    state = {fileUrl:'', file: '', filename:''}
    handleChange = e => {
      const file = e.target.files[0]
      this.setState({
        fileUrl: URL.createObjectURL(file),
        file,
        filename: file.name
      })
      saveFile = () => {
        Storage.put(this.state.filename, this.state.file)
          .then(()=> {
            console.log("SUCCESS")
            this.setState({fileURL:'', file:'', filename:''})
          })
          .catch(err => {
            console.log(err)
          })
      }
    }

    /*constructor(props){
        super(props);
        this.state = {
            
            }
    }
    
    upload(fileInput) {

        console.log(fileInput.name)
        var file = fileInput;
        var newFileName = fileInput.name;

        const config = {
            bucketName: "figures-odu-examples-6-27-2021",
            region: "us-east-1",
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
          };
        //console.log(config)
        const ReactS3Client = new S3(config);

        ReactS3Client.uploadFile(file, newFileName).then(data=>console.log(data)).catch(err=>console.error(err))*/
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
        });


    }*/
}