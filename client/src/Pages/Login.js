import React, {useState, useEffect} from 'react';
import axios from 'axios';


function Login() {
  const [authValues, setAuthValues] = useState(null);
  
  useEffect(() => {
    console.log("effect");
    (async () => {
      let response = await axios.get('/api/sso')
      console.log(response);
     setAuthValues(response.data)
    
    console.log("response", authValues);
    })()
  
  },[])
 
  return (
    <div className="App">
      {authValues === null ? null :
      <a href={"https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=" + authValues.CALLBACKURL + "&client_id=" + authValues.CLIENTID + "&scope=" + authValues.ESI + "&state=" + authValues.STATE}><button>login</button></a>
      }
  
    </div>
  );
}

export default Login;
