import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import tokenBridge from './tokenBridge';

const authContext = createContext();
// axios.interceptors.request.use(
//   async (config) => {
//     config.headers['Authorization'] = `Bearer ${tokenBridge.getToken()}`;
//     console.log(config);
//     console.log('This is an interceptor message');
//     return config;
//   },
//   async (error) => {
//     return Promise.reject(error);
//   }
// );

function ProvideAuth({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      console.log('deleting your stuff!');
      setUser(null);
    }, 30000);
  }, []);

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
}

function useAuth() {
  return useContext(authContext);
}

export { ProvideAuth, useAuth };
