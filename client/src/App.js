import './App.css';
import 'bootswatch/dist/cyborg/bootstrap.css';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
          <Link to='/' className='navbar-brand'>
            Auth Refresher
          </Link>
          {/* <a className='navbar-brand' href='#'>
            Auth Refresher
          </a> */}
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navbarColor01'
            aria-controls='navbarColor01'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <a className='nav-link active' aria-current='page' href='#'>
                  Login
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/signup'>
          <Signup />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
