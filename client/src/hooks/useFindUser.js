import { useState, useEffect } from 'react';

export default function useFindUser() {
  const [user, setUser] = useState(null);
  const [testvalue, setTestValue] = useState('testvalue');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(null);
  }, []);

  return {
    user,
    setUser,
    testvalue,
    isLoading,
  };
}

// Yun Asaki Kishunuba
