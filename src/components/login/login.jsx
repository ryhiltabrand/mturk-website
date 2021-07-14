import React, { Component } from 'react';
import { Authenticator, Auth } from 'aws-amplify-react';
function refreshPage(){ 
    window.location.reload(false); 
}
export class Logins extends Component {
    render(){
        return (
            <div>
             <Authenticator />
             {/*refreshPage()*/}
            </div>
        
        )
    }
}
