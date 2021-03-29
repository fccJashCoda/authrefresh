import { useState, useEffect } from 'react';
import Loader from './Loader';
import Joi from 'joi';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log(password);

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
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type='text'
              required
              className='form-control'
              aria-describedby='usernameHelp'
              id='username'
              name='username'
              placeholder='Enter username'
            />
            <small id='usernameHelp' className='form-text text-muted'>
              Enter your username to login.
            </small>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <label htmlFor='password' className='form-label'>
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                required
                className='form-control'
                aria-describedby='passwordHelp'
                id='password'
                name='password'
                placeholder='Password'
              />
              <small id='passwordHelp' className='form-text text-muted'>
                Enter your password to login.
              </small>
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
