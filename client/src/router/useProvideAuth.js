import { useState } from 'react';

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = async (username, password) => {
    const API_URL = '/auth/login';

    const payload = {
      username,
      password,
    };

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      console.log('login attempt');
      const response = await fetch(API_URL, options);
      const result = await response.json();

      if (response.status === 200) {
        console.log('logged in');
        await localStorage.setItem('token', result.token);
        // window.location.href = '/dashboard';
        await setUser(result);
        return result;
      } else {
        throw new Error('Invalid Username or Password');
      }
    } catch (error) {
      console.log('login error');
      console.log(error.message);
      return { error: error.message };
    }
  };
  // const signin = (usename, password) => {
  //   return auth.signin(() => {
  //     setUser('bob');
  //   });
  // };

  const signout = (cb) => {
    return () => {
      setUser(null);
      cb();
    };
  };

  return {
    user,
    signin,
    signout,
  };
}

export default useProvideAuth;
