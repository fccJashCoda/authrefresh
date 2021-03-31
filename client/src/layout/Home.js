import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <div className='home'>
        <div className='jumbotron text-center'>
          <h1 className='display-3'>Authentication for rusty people 🦀</h1>
          <p className='lead'>Spaced repetition is kewl</p>
          <hr className='my-4' />
          <p>Click here to register</p>
          <p className='lead'>
            <Link to='/signup' className='btn btn-warning'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-info ml-2'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;