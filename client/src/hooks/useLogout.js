import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';

const useLogout = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);

  const logoutUser = () => {
    setUser(null);
    history.push('/');
  };

  return {
    logoutUser,
  };
};

export default useLogout;
