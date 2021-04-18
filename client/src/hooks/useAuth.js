import { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
  let history = useHistory();
  const { setUser } = useContext(UserContext);

  const setUserContext = async () => {
    return await axios
      .get('/auth/v2/user')
      .then((res) => {
        console.log('settint user context');
        console.log(res);
        setUser(res.data.currentUser);
        history.push('/dashboard');
      })
      .catch((err) => console.log(err));
  };

  const loginUser = async (data) => {
    const { username, password } = data;
    return axios
      .post('auth/v2/login', {
        username,
        password,
      })
      .then(async (res) => {
        console.log(res.data.status);
        return await setUserContext();
      })
      .catch((err) => console.log(err));
  };

  const registerUser = async () => {};

  return {
    loginUser,
    registerUser,
  };
};

export default useAuth;
