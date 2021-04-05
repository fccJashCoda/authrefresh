import { createContext, useContext, useState, useEffect } from 'react';
// import useProvideAuth from './useProvideAuth';
import axios from 'axios';
import tokenBridge from './tokenBridge';

const authContext = createContext();
axios.interceptors.request.use(
  async (config) => {
    config.headers['Authorization'] = `Bearer ${'nuggets'}`;
    // config.headers['Authorization'] = `Bearer ${tokenBridge.getToken()}`;
    console.log(config);
    console.log('This is an interceptor message');
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

function ProvideAuth({ children }) {
  // const auth = useProvideAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // setInterval(() => {
    //   const token = localStorage.getItem('token');
    //   console.log(token);
    //   console.log(new Date());
    //   console.log('doing a thing');
    // }, 1000);
    setTimeout(() => {
      const message = tokenBridge.getToken();
      console.log(`SUPer SecRet MesSage: ${message}`);
      console.log('deleting your stuff!');
      setUser(null);
    }, 30000);
  }, []);

  // useEffect(() => {
  // }, []);
  useEffect(() => {
    const sayHi = async () => {
      axios
        .get('/api/v1/notes')
        .then((data) => {
          console.log(data);
          console.log('hitting the front page');
        })
        .catch((err) => console.log(err.message));
    };
    setTimeout(() => sayHi(), 30000);
  }, []);

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  );
  // return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useAuth() {
  return useContext(authContext);
}

export { ProvideAuth, useAuth };
