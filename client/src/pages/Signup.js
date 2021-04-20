import { useState, useEffect, useContext } from 'react';
import Joi from 'joi';
import Loader from '../components/Loader';
import Inputcomponent from '../components/InputComponent';
import { UserContext } from '../hooks/UserContext';
import { useHistory } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
  confirmPassword: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$'))
    .required(),
});

function Signup() {
  const [errorMessage, setErrorMessage] = useState('');
  const { registerUser, error } = useAuth();
  const { values, handleChange } = useForm({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { user, isLoading } = useContext(UserContext);
  const history = useHistory();

  const validateUser = () => {
    if (values.password !== values.confirmPassword) {
      return setErrorMessage('Password and Confirm Password must match');
    }

    const result = schema.validate(values);

    console.log(result);

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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (validateUser()) {
      console.log(values);
      registerUser({
        username: values.username,
        password: values.password,
      });
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [values.username, values.password, values.confirmPassword]);

  useEffect(() => {
    if (user) {
      history.push('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    if (error && error.message.includes(409)) {
      setErrorMessage('Invalid Username');
    }
  }, [error]);

  const signupHelp = {
    username:
      'Username must be longer than two characters and shorter than 30. Username must be alphanumeric, underscores are allowed.',
    password: 'Password must be at least 10 characters.',
    confirmPassword: 'Please confirm password',
  };

  return (
    <section className='container'>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={(e) => handleSignup(e)} className='mt-3'>
          <h1>Signup</h1>
          {errorMessage && (
            <div className='alert alert-danger'>{errorMessage}</div>
          )}
          <div className='mb-3'>
            <Inputcomponent
              name='username'
              title='Username'
              placeholder='Enter username'
              action={handleChange}
              message={signupHelp.username}
              value={values.username}
            />
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <Inputcomponent
                type='password'
                name='password'
                title='Password'
                placeholder='Password'
                action={handleChange}
                message={signupHelp.password}
                value={values.password}
              />
            </div>
            <div className='col'>
              <Inputcomponent
                type='password'
                name='confirmPassword'
                title='Confirm Password'
                placeholder='Confirm Password'
                action={handleChange}
                message={signupHelp.confirmPassword}
                value={values.confirmPassword}
              />
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
