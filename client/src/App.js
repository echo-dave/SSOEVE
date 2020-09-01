import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Login from "./Pages/Login";
import Services from "./Pages/Services";


function App() {  
  useEffect(() => {

  },[])
 
  return (
    <Router>
      <div className="App">
      <Switch>
      <Route exact path="/" component={Login}/>
      {/* <Route path="/auth/" component={Auth}/> */}
      <Route path="/services/" component={Services}/>

        
      </Switch> 
      </div>
    </Router>
  );
}

export default App;
