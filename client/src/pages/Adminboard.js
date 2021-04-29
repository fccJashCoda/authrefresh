import { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import UserList from '../components/UserList';
import useForm from '../hooks/useForm';

// /api/v2/users/
// /api/v2/users/:id
const Adminboard = () => {
  const [userList, setUserList] = useState([]);
  // const [filteredList, setFilteredList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [targetId, setTargetId] = useState('');

  const { values, handleChange } = useForm({
    initialValues: {
      pattern: '',
    },
  });

  useEffect(() => {
    const populateUserList = async () => {
      try {
        const response = await axios.get('/api/v2/users');
        console.log(response);
        setUserList(response.data);
        // setFilteredList(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    populateUserList();
  }, []);

  useEffect(() => {
    setTargetId(selectedUser._id);
    console.log('apilink: ');
  }, [selectedUser]);

  useEffect(() => {
    console.log(targetId);
  }, [targetId]);

  // useEffect(() => {
  //   setFilteredList(
  //     userList.filter((user) => user.username.startsWith(values.pattern))
  //   );
  // }, [values.pattern]);

  return (
    <section>
      <h1>Adminboard</h1>

      <section class='container'>
        <UserList userList={userList} />
      </section>
    </section>
  );
};

export default Adminboard;
