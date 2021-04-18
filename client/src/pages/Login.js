import { useState, useEffect, useContext } from 'react';
import Loader from '../components/Loader';
import Joi from 'joi';
import useAuth from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import tokenBridge from '../router/tokenBridge';
import { UserContext } from '../hooks/UserContext';

import InputComponent from '../components/InputComponent';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  const { user, isLoading } = useContext(UserContext);
  const { loginUser, error } = useAuth();
  const history = useHistory();

  const validateUser = () => {
    const result = schema.validate({ username, password });

    if (!result.error) return true;

    if (result.error.message.includes('username')) {
      setErrorMessage('Invalid Username');
    } else {
      setErrorMessage('Invalid Password');
    }
    return false;
  };

  const login = async (e) => {
    e.preventDefault();

    if (validateUser()) {
      console.log('user is valid, proceeding to login');
      // setIsLoading(true);
      loginUser({ username, password });
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 1000);
      //   try {
      //     setIsLoading(true);
      //     const API_URL = '/auth/login';
      //     const response = await axios.post(API_URL, {
      //       username: username,
      //       password: password,
      //     });
      //     console.log('response before throw', response);
      //     if (response.status === 200) {
      //       console.log('response: ', response);
      //       tokenBridge.setToken(response.data.token);
      //       setUser(response.data.user);
      //       history.push('/dashboard');
      //     } else {
      //       console.log('error: ', response);
      //     }
      //   } catch (error) {
      //     setIsLoading(false);
      //     setErrorMessage(error.response.data.message);
      //   }
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [username, password]);

  useEffect(() => {
    if (user) {
      history.push('/dashboard');
    }
  }, []);

  useEffect(() => {
    if (error && error.message.includes(401)) {
      setErrorMessage('Invalid Username or Password');
    }
  }, [error]);

  const loginHelp = {
    username: 'Enter your username to login.',
    password: 'Enter your password to login.',
  };

  return (
    <section className='container'>
      {isLoading && <Loader />}
      {/* {!isLoading && ( */}
      <form onSubmit={(e) => login(e)} className='mt-3'>
        <h1>Login</h1>
        {errorMessage && (
          <div className='alert alert-danger' role='alert'>
            {errorMessage}
          </div>
        )}
        <div className='mb-3'>
          <InputComponent
            name='username'
            title='Username'
            action={setUsername}
            placeholder='Enter username'
            message={loginHelp.username}
          />
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <InputComponent
              name='password'
              title='Password'
              type='password'
              action={setPassword}
              placeholder='Password'
              message={loginHelp.username}
            />
          </div>
        </div>
        <button type='submit' className='btn btn-primary mb-5'>
          Login
        </button>
      </form>
      {/* )} */}
      <p>Safety {user ? 'OFF' : 'ON'}</p>
    </section>
  );
}

export default Login;
