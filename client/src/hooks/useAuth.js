import { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useHistory } from 'react-router-dom';

const useAuth = () => {
  let history = useHistory();
  const { setUser } = useContext(UserContext);

  const loginUser = async () => {
    setUser({
      username: 'bill murray',
      password: 'twinkies',
    });
    history.push('/');
  };

  const registerUser = async () => {};

  return {
    loginUser,
    registerUser,
  };
};

export default useAuth;
