import { useContext } from 'react';
import { UserContext } from '../hooks/UserContext';
import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

function Home() {
  const { user } = useContext(UserContext);
  const { logoutUser } = useLogout();

  return (
    <>
      <div className='home'>
        <div className='jumbotron text-center'>
          <h1 className='display-3'>Authentication for rusty people 🦀</h1>
          <p className='lead'>Spaced repetition is kewl</p>
          <hr className='my-4' />
          <p>Click here to {user ? 'logout' : 'register'}</p>
          <p className='lead'>
            {user ? (
              <button className='btn btn-danger' onClick={() => logoutUser()}>
                Logout
              </button>
            ) : (
              <>
                <Link to='/signup' className='btn btn-warning'>
                  Sign Up
                </Link>
                <Link to='/login' className='btn btn-info ml-2'>
                  Login
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
