import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFindUser() {
  const [user, setUser] = useState(null);
  const [testvalue, setTestValue] = useState('testvalue');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findUser = async () => {
      await axios
        .get('/auth/v2/user')
        .then((res) => {
          setUser(res.data.currentUser);
        })
        .catch((err) => console.log(err));
    };
    findUser();
  }, []);

  return {
    user,
    setUser,
    testvalue,
    isLoading,
  };
}

// Yun Asaki Kishunuba
