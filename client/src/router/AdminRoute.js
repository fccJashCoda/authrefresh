import { useContext } from 'react';
import { UserContext } from '../hooks/UserContext';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ children, ...rest }) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user.role === 'admin' ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
