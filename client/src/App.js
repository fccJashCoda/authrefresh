import './App.css';
import 'bootswatch/dist/cyborg/bootstrap.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/404';
import PrivateRoute from './router/PrivateRoute';
import { UserContext } from './hooks/UserContext';
import useFindUser from './hooks/useFindUser';
import Header from './sections/Header';
import Account from './pages/Account';
import Adminboard from './pages/Adminboard';
import AdminRoute from './router/AdminRoute';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  const { user, setUser, isLoading, setIsLoading } = useFindUser();

  console.log(user);
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
        <div className='App'>
          <Header />
          <main>
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <PrivateRoute exact path='/dashboard'>
                <Dashboard />
              </PrivateRoute>
              <PrivateRoute exact path='/adminboard'>
                <AdminRoute>
                  <Adminboard />
                </AdminRoute>
              </PrivateRoute>
              <Route exact path='/login'>
                <Login />
              </Route>
              <Route exact path='/signup'>
                <Signup />
              </Route>
              <Route exact path='/account'>
                <Account />
              </Route>
              <Route path='*'>
                <NotFound />
              </Route>
            </Switch>
          </main>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
