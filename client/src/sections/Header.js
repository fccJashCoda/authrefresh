import { useContext } from 'react';
import { UserContext } from '../hooks/UserContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, testvalue } = useContext(UserContext);

  console.log('testvalue', testvalue);

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <Link to='/' className='navbar-brand'>
        Auth Refresher
      </Link>
      <Link to='/dashboard' className=''>
        Dashboard
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
          {user ? (
            <li className='nav-item'>
              <a className='nav-link active' aria-current='page' href='#'>
                Welcome, {user.username}
              </a>
            </li>
          ) : (
            <li className='nav-item'>
              <a className='nav-link active' aria-current='page' href='#'>
                Login
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
