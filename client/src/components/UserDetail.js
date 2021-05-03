import { useState } from 'react';
import Joi from 'joi';

import useForm from '../hooks/useForm';
import InputComponent from './InputComponent';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
  confirmPassword: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$'))
    .required(),
});

const UserDetail = (props) => {
  const user = props.payload[0];
  const { values, handleChange } = useForm({
    initialValues: {
      newUsername: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <>
      <img src='https://via.placeholder.com/150' alt='user profile' />
      <p>User details</p>
      <p>{user.username}</p>
      <span>Id: {user._id}</span>
      <p>Joined: {user.createdAt}</p>
      <p>Last Updated: {user.updatedAt}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.active ? 'Active' : 'Inactive'}</p>

      <hr />

      <form>
        <div className='mb-3'>
          <div className='mb-3'>
            <InputComponent
              name='newUsername'
              title='New Username'
              placeholder='Enter a new username'
              action={handleChange}
              // message={signupHelp.username}
              value={values.username}
            />
          </div>

          <div className='row mb-3'>
            <div className='col'>
              <InputComponent
                name='newPassword'
                title='New Password'
                placeholder='Enter new password'
                action={handleChange}
                // message={signupHelp.username}
                value={values.username}
              />
            </div>
            <div className='col'>
              <InputComponent
                name='confirmPassword'
                title='Confirm Password'
                placeholder='Confirm Password'
                action={handleChange}
                // message={signupHelp.username}
                value={values.username}
              />
            </div>
          </div>
        </div>
        <button type='submit' className='btn btn-primary mb-3'>
          Submit
        </button>
      </form>
    </>
  );
};

export default UserDetail;
