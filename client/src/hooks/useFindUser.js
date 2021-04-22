import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFindUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const findUser = async () => {
      await axios
        .get('/auth/v2/user')
        .then((res) => {
          console.log('useFindUser res: ', res);
          setUser(res.data.currentUser);
        })
        .catch((err) => console.log(err));
    };
    findUser();
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
  };
}
