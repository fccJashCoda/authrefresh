import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Joi from 'joi';
// import useProvideAuth from '../router/useProvideAuth';
import { useAuth } from '../router/ProvideAuth';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import tokenBridge from '../router/tokenBridge';

import InputComponent from '../components/InputComponent';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

const temptoken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUzZTU2MjQwY2VkNzZhOGNhYzM5MDciLCJ1c2VybmFtZSI6IlN1cGVydXNlciIsImlhdCI6MTYxNzY1Njk0MywiZXhwIjoxNjE3NzQzMzQzfQ.oYhvP90c7jzi6PjO3CPeHx4VBRsTSfnFAtHdJ8amACY';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const location = useLocation();
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
  // const { from } = location.state || { from: { pathname: '/' } };
  // const redir = () => {
  //   history.replace(from);
  // };
  const login = async (e) => {
    e.preventDefault();

    if (validateUser()) {
      auth.setUser({ username: 'garblegarble' });
      tokenBridge.setToken(temptoken);
      console.log('axios: ', axios);
      console.log(auth.setHeader);
      console.log('ok we should be logged in');
      history.push('/dashboard');
      // setIsLoading(true);
      // try {
      //   const response = await auth.signin(username, password, redir);
      //   await setTimeout(() => {
      //     if (response.error) {
      //       setIsLoading(false);
      //       setErrorMessage(response.error);
      //     } else {
      //       console.log('res', response);
      //       console.log('user', auth.user);
      //       console.log('error: ', response.error);
      //       console.log('auth: ', auth);
      //       history.push('/dashboard');
      //       setIsLoading(false);
      //     }
      //   }, 1000);
      // } catch (error) {
      //   console.log('ERROR:', error);
      // }
      // await auth.signin(username, password).then((res) => {
      //   setTimeout(() => {
      //     if (res.error) {
      //       setIsLoading(false);
      //       setErrorMessage(res.error);
      //     } else {
      //       console.log('res', res);
      //       console.log('user', auth.user);
      //       console.log('error: ', res.error);
      //       setIsLoading(false);
      //     }
      //   }, 1000);
      // });
      // await auth.signin(username, password).then((res) => {
      //   setTimeout(() => {
      //     if (res.error) {
      //       setIsLoading(false);
      //       setErrorMessage(res.error);
      //     } else {
      //       console.log('res', res);
      //       console.log('user', auth.user);
      //       console.log('error: ', res.error);
      //       setIsLoading(false);
      //     }
      //   }, 1000);
      // });
      // const API_URL = '/auth/login';
      // const payload = {
      //   username,
      //   password,
      // };
      // const options = {
      //   method: 'POST',
      //   headers: {
      //     'content-type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      // };
      // try {
      //   const response = await fetch(API_URL, options);
      //   const result = await response.json();
      //   setIsLoading(true);
      //   setTimeout(() => {
      //     if (response.status === 200) {
      //       localStorage.setItem('token', result.token);
      //       window.location.href = '/dashboard';
      //     } else {
      //       setErrorMessage('Invalid Username or Password');
      //       setIsLoading(false);
      //     }
      //   }, 1500);
      // } catch (error) {
      //   setErrorMessage(error.message);
      // }
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [username, password]);

  // useEffect(() => {
  //   const auth = async (token) => {
  //     const response = await fetch('/auth', {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `bearer ${token}`,
  //       },
  //     });
  //     const auth = await response.json();
  //     if (auth.user) {
  //       window.location.href = '/dashboard';
  //     }
  //   };
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     auth(token);
  //   }
  // }, []);

  if (auth.user) {
    history.push('/');
  }

  const loginHelp = {
    username: 'Enter your username to login.',
    password: 'Enter your password to login.',
  };

  return (
    <section className='container'>
      {isLoading && <Loader />}
      {!isLoading && (
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
      )}
      <p>Safety {auth.user ? 'OFF' : 'ON'}</p>
    </section>
  );
}

export default Login;
