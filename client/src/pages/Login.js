import { useState, useEffect, useContext } from 'react';
import Loader from '../components/Loader';
import Joi from 'joi';
import useAuth from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import useForm from '../hooks/useForm';

import InputComponent from '../components/InputComponent';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const { values, handleChange } = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const { user, isLoading } = useContext(UserContext);
  const { loginUser, error } = useAuth();
  const history = useHistory();

  const validateUser = () => {
    const result = schema.validate(values);

    if (!result.error) return true;

    if (result.error.message.includes('username')) {
      setErrorMessage('Invalid Username');
    } else {
      setErrorMessage('Invalid Password');
    }
    return false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateUser()) {
      loginUser({
        username: values.username,
        password: values.password,
      });
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [values.username, values.password]);

  useEffect(() => {
    if (user) {
      history.push('/dashboard');
    }
  }, [user]);

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
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={(e) => handleLogin(e)} className='mt-3'>
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
              action={handleChange}
              value={values.username}
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
                action={handleChange}
                value={values.password}
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
