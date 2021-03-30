import { useState, useEffect } from 'react';
import Joi from 'joi';
import Loader from '../components/Loader';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
  confirmPassword: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$'))
    .required(),
});

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUser = () => {
    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password must match');
    }

    const result = schema.validate({ username, password, confirmPassword });

    if (!result.error) {
      return true;
    }

    if (result.error.message.includes('username')) {
      setErrorMessage('Invalid Username');
    } else {
      setErrorMessage('Invalid Password');
    }
    return false;
  };

  const signup = async (e) => {
    e.preventDefault();

    if (validateUser()) {
      const API_URL = '/auth/signup';
      const payload = {
        username,
        password,
      };

      console.log(payload);

      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      setIsLoading(true);
      try {
        const response = await fetch(API_URL, options);
        const result = await response.json();
        await setTimeout(() => {
          if (response.status === 200) {
            localStorage.setItem('token', result.token);
            window.location.href = '/dashboard';
          } else {
            setErrorMessage(result.message);
          }
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        await setTimeout(() => {
          setErrorMessage(error.message);
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [username, password, confirmPassword]);

  return (
    <section>
      {isLoading && <Loader />}
      {!isLoading && (
        <form onSubmit={(e) => signup(e)} className='mt-3'>
          <h1>Signup</h1>
          {errorMessage && (
            <div className='alert alert-danger'>{errorMessage}</div>
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
              Username must be longer than two characters and shorter than 30.
              Username must be alphanumeric, underscores are allowed.
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
                Password must be at least 10 characters
              </small>
            </div>
            <div className='col'>
              <label htmlFor='confirmPassword' className='form-label'>
                Confirm Password
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type='password'
                required
                className='form-control'
                aria-describedby='confirmPasswordHelp'
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Confirm Password'
              />
              <small id='confirmPasswordHelp' className='form-text text-muted'>
                Please confirm password
              </small>
            </div>
          </div>
          <button type='submit' className='btn btn-primary mb-5'>
            Sign-up
          </button>
        </form>
      )}
    </section>
  );
}

export default Signup;
