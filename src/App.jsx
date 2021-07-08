import React, {Component} from "react";
import './App.css';
import { NavLink, Switch, Route } from 'react-router-dom';
import{Login} from "./components/login/index"
import mturk from './components/mturk.jsx';
import ListHits from './components/getturk'
import AddHit from './components/addhit'
import S3upload from './components/uploads3'

const App = () => (
  <div className='app'>
    <h1>O.D.U. AWSMTURK DEMO</h1>
    {/*<Login />*/}
    <Navigation />
    <Main />
  </div>
);

const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
      <li><NavLink exact activeClassName="current" to='/Hits'>Hits</NavLink></li>
      <li><NavLink exact activeClassName="current" to='/HitAdder'>Add Hit</NavLink></li>
      <li><NavLink exact activeClassName="current" to='/Balance'>Balance</NavLink></li>
    </ul>
  </nav>
);

const Main = () => {
  return(
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/Hits' component={Hits}></Route>
      <Route exact path='/HitAdder' component={HitAdder}></Route>
      <Route exact path='/Balance' component={Balance}></Route>
    </Switch>
  );
}
  
function Home() {
  return(
    <div className='home'>
      <h1>Welcome to my demo MTURK website</h1>
      <p> Work in Progress</p>
    </div>
  )
}


class Hits extends Component {
  render(){
  return(
   <div className='hits'>
      <ListHits />
    </div>
  ) 
  }
  
}

class HitAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      maxAssignments: 0,
      lifeTimeInSeconds: 0,
      assignmentDurationInSeconds: 0,
      rewardInCents: 0.00,
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
    alert("you have inputed \n"+"Title: "+this.state.title+"\nDescription: "+this.state.description+"\nMax Assignments: "+this.state.maxAssignments+"\nLifetime In Seconds: "+this.state.lifeTimeInSeconds+"\nAssignment Duration In Seconds: "+this.state.assignmentDurationInSeconds+"\nReward: "+this.state.rewardInCents)
    ahit.CreateHit(this.state.title, this.state.description, this.state.maxAssignments, this.state.lifeTimeInSeconds, this.state.assignmentDurationInSeconds, this.state.rewardInCents, this.fileInput.current.files[0].name)
    s3.upload(this.fileInput.current.files[0])
    //`\n Selected File -${this.fileInput.current.files[0].name}`
  }

  

  render(){
    const ahit = new AddHit();
    function creator(){
      ahit.CreateHit()
    }
    return(
      <div className = 'HitAdder'>
        <h1>Add a Hit</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              Title: <br />
                <input name="title" type="text" required checked={this.state.title} onChange={this.handleInputChange} />
            </label> <br />
            <label>
              Description: <br />
                <input name="description" type="text" required checked={this.state.description} onChange={this.handleInputChange} />
            </label> <br />
            <label>
              Max Assignments: <br />
                <input name="maxAssignments" type="number" required checked={this.state.maxAssignments} onChange={this.handleInputChange} />
            </label> <br />
            <label>
              Lifetime In Seconds: <br />
                <input name="lifeTimeInSeconds" type="number" required checked={this.state.lifeTimeInSeconds} onChange={this.handleInputChange} />
            </label> <br />
            <label>
              Assignment Duration In Seconds: <br />
                <input name="assignmentDurationInSeconds" type="number" required checked={this.state.assignmentDurationInSeconds} onChange={this.handleInputChange} />
            </label> <br />
            <label>
              Reward In Cents(write 0.00 form): <br />
                <input name="rewardInCents" type="text" required checked={this.state.rewardInCents} onChange={this.handleInputChange} />
            </label> <br />
            <label>
              Image to be Uploaded <br />
                <input name="file" type="file" ref={this.fileInput}/>
            </label> <br />
            <input type='submit' />
          </form>
          {/*<button onClick={creator}>Create Your Hit</button>*/}
      </div>
    )

  }

}


class Balance extends Component {
  render() {
    const MTURK = new mturk();
    
    return (
      <div className = 'balance'>
      <h1>Balance</h1>
      <div id="output"></div>
      <script>{MTURK.getAccountBalance()}</script>
      </div>  
  );
  }   
}

export default App;