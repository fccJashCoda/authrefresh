import { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
  let history = useHistory();
  const { setUser, setIsLoading } = useContext(UserContext);
  const [error, setError] = useState(null);

  const setUserContext = async () => {
    return await axios
      .get('/auth/v2/user')
      .then((res) => {
        console.log('setting user context');
        console.log(res);
        setUser(res.data.currentUser);
        setIsLoading(false);
        history.push('/dashboard');
      })
      .catch((err) => console.log('setusercontext error: ', err));
  };

  const loginUser = async (data) => {
    const { username, password } = data;
    setIsLoading(true);
    return axios
      .post('auth/v2/login', {
        username,
        password,
      })
      .then(async (res) => {
        console.log('login response');
        console.log(res.data.status);
        return await setUserContext();
      })
      .catch((err) => {
        setTimeout(() => {
          setError(err);
          setIsLoading(false);
        }, 1000);
      });
  };

  const registerUser = async (data) => {
    const { username, password } = data;
    setIsLoading(true);
    return axios
      .post('auth/v2/signup', {
        username,
        password,
      })
      .then(async (res) => {
        console.log(res);
        return await setUserContext();
      })
      .catch((err) => {
        setTimeout(() => {
          setError(err);
          setIsLoading(false);
        }, 1000);
      });
  };

  return {
    loginUser,
    registerUser,
    error,
  };
};

export default useAuth;
