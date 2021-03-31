import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Joi from 'joi';

import InputComponent from '../components/InputComponent';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const API_URL = '/auth/login';

      const payload = {
        username,
        password,
      };

      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      try {
        const response = await fetch(API_URL, options);
        const result = await response.json();

        setIsLoading(true);
        setTimeout(() => {
          if (response.status === 200) {
            localStorage.setItem('token', result.token);
            window.location.href = '/dashboard';
          } else {
            throw new Error('Invalid Username or Password');
          }
        }, 1500);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [username, password]);

  useEffect(() => {
    const auth = async (token) => {
      const response = await fetch('/auth', {
        method: 'GET',
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      const auth = await response.json();
      if (auth.user) {
        window.location.href = '/dashboard';
      }
    };
    const token = localStorage.getItem('token');
    if (token) {
      auth(token);
    }
  }, []);

  const loginHelp = {
    username: 'Enter your username to login.',
    password: 'Enter your password to login.',
  };

  return (
    <section>
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
    </section>
  );
}

export default Login;
