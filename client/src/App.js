import './App.css';
import 'bootswatch/dist/cyborg/bootstrap.css';
import Home from './layout/Home';
import Signup from './layout/Signup';
import Login from './layout/Login';
import Dashboard from './layout/Dashboard';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
          <Link to='/' className='navbar-brand'>
            Auth Refresher
          </Link>
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
              {/* <li className='nav-item'>
                <a className='nav-link active' aria-current='page' href='#'>
                  Login
                </a>
              </li> */}
            </ul>
          </div>
        </nav>
        <main>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <div className='container'>
              <Route exact path='/dashboard'>
                <Dashboard />
              </Route>
              <Route exact path='/login'>
                <Login />
              </Route>
              <Route exact path='/signup'>
                <Signup />
              </Route>
            </div>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
