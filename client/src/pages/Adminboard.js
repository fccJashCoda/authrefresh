import { useState, useEffect } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useRouteMatch,
  Link,
} from 'react-router-dom';
import axios from 'axios';

import UserList from '../components/UserList';
import UserDetail from '../components/UserDetail';

// /api/v2/users/
// /api/v2/users/:id
const Adminboard = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [targetId, setTargetId] = useState('');

  const history = useHistory();
  const match = useRouteMatch();

  const goBack = () => {
    history.push('/adminboard');
  };

  const checkUser = (id) => {
    setTargetId(id);
    history.push(`/adminboard/${id}`);
  };

  useEffect(() => {
    const populateUserList = async () => {
      try {
        const response = await axios.get('/api/v2/users');
        setUserList(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    populateUserList();
  }, []);

  return (
    <section>
      <h1>Adminboard</h1>
      <section class='container'>
        <Switch>
          <Route exact path={match.path}>
            <UserList userList={userList} action={checkUser} />
          </Route>
          <Route path={`${match.path}/:id`}>
            <UserDetail
              payload={userList.filter((usr) => usr._id === targetId)}
              action={goBack}
            />
          </Route>
          -
        </Switch>
      </section>
    </section>
  );
};

export default Adminboard;
