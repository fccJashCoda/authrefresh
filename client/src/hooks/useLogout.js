import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';
import axios from 'axios';

const useLogout = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);

  const logoutUser = async () => {
    const logout = await axios.get('auth/v2/logout');
    console.log('logout', logout);
    setUser(null);
    history.push('/');
  };

  return {
    logoutUser,
  };
};

export default useLogout;
