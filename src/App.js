//React Router Imports
import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';

//Pages
import {Home} from './pages/home/Home';
import {Login} from './pages/login/Login';
import {Signup} from './pages/signup/Signup';


//Components
import {Navbar} from './components/Navbar/Navbar';

//AuthContext

import { useAuthContext} from './hooks/useAuthContext';

function App() {

  const {authIsReady, user} = useAuthContext();

  return (
    <div className="App">
      { authIsReady &&
      <BrowserRouter>

    <Navbar />


      <Switch>

        <Route exact path='/'>
          {user && user.displayName ? <Home /> : <Redirect to="/login"></Redirect>}
        </Route>

        <Route path='/login'>
          {user && user.displayName ? <Redirect to="/"></Redirect> : <Login />}
        </Route>

        <Route path='/signup'>
          {user && user.displayName  ? <Redirect to="/"></Redirect> : <Signup />}
        </Route>

      </Switch>
      
      </BrowserRouter>
      }
    </div>
  );
}

export default App;
