import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';

import useForm from '../hooks/useForm';
import InputComponent from './InputComponent';

const schema = Joi.object({
  newUsername: Joi.string().alphanum().min(3).max(30),
  newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')),
  confirmPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')),
});

const UserDetail = (props) => {
  const history = useHistory();
  const [profile, setProfile] = useState(props.payload[0] || null);
  const [errorMessage, setErrorMessage] = useState('');
  const { values, handleChange } = useForm({
    initialValues: {
      newUsername: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [activeStatus, setActiveStatus] = useState(false);
  const [role, setRole] = useState('');

  const validatePayload = () => {
    if (values.newPassword !== values.confirmPassword) {
      setErrorMessage('Password and Confirm Password must match');
      return false;
    }

    const payload = {
      newUsername: values.newUsername || 'aaaaaaaa',
      newPassword: values.newPassword || 'aaaaaa11',
      confirmPassword: values.confirmPassword || 'aaaaaa11',
    };
    const result = schema.validate(payload);

    if (!result.error) {
      return true;
    }

    if (result.error.message.includes('newUsername')) {
      setErrorMessage('Invalid Username');
    } else {
      setErrorMessage('Invalid Password');
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePayload()) {
      const payload = {
        username: values.newUsername || profile.username,
        active: activeStatus,
        role,
      };
      if (values.newPassword) {
        payload.password = values.newPassword;
      }
      console.log(payload);
      const patched = await axios.patch(
        `/api/v2/users/${profile._id}`,
        payload
      );
      if (patched.status === 200) {
        history.push('/adminboard');
      }
    }
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    setErrorMessage('');
  }, [values]);

  useEffect(() => {
    if (!profile) {
      history.push('/adminboard');
    } else {
      setActiveStatus(profile.active);
      setRole(profile.role);
    }
  }, []);

  return (
    <>
      {profile && (
        <div>
          <img src='https://via.placeholder.com/150' alt='user profile' />
          <p>User details</p>
          <p>{profile.username}</p>
          <span>Id: {profile._id}</span>
          <p>Joined: {profile.createdAt}</p>
          <p>Last Updated: {profile.updatedAt}</p>
          <p>Role: {profile.role}</p>
          <p>Status: {profile.active ? 'Active' : 'Inactive'}</p>
        </div>
      )}

      <hr />

      <form onSubmit={handleSubmit}>
        {errorMessage ? (
          <div class='alert alert-danger' role='alert'>
            {errorMessage}
          </div>
        ) : (
          <></>
        )}
        <div className='mb-3'>
          <div className='mb-3'>
            <InputComponent
              name='newUsername'
              title='New Username'
              placeholder='Enter a new username'
              action={handleChange}
              value={values.username}
              ignore={true}
            />
          </div>

          <div className='row mb-3'>
            <div className='col'>
              <InputComponent
                name='newPassword'
                title='New Password'
                placeholder='Enter new password'
                action={handleChange}
                value={values.username}
                ignore={true}
              />
            </div>
            <div className='col'>
              <InputComponent
                name='confirmPassword'
                title='Confirm Password'
                placeholder='Confirm Password'
                action={handleChange}
                value={values.username}
                ignore={true}
              />
            </div>
          </div>
        </div>

        <fieldset>
          <div class='form-group'>
            <label for='exampleSelect1' class='form-label mt-4'>
              Role{' '}
            </label>
            <select
              value={role}
              class='form-select'
              id='exampleSelect1'
              onChange={handleRole}
            >
              <option>user</option>
              <option>admin</option>
            </select>
          </div>
          <div class='form-group'>
            <div class='custom-control custom-switch'>
              <input
                type='checkbox'
                class='custom-control-input'
                id='customSwitch1'
                name='active'
                onChange={() => {
                  setActiveStatus(!activeStatus);
                  console.log(activeStatus);
                }}
                checked={activeStatus}
              />
              <label class='custom-control-label' for='customSwitch1'>
                Toggle this switch element
              </label>
            </div>
          </div>
        </fieldset>

        <button type='submit' className='btn btn-primary mb-3'>
          Submit
        </button>
      </form>
    </>
  );
};

export default UserDetail;
