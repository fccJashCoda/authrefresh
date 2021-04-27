import { useState, useEffect } from 'react';
import axios from 'axios';

// /api/v2/users/
// /api/v2/users/:id
const Adminboard = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [targetId, setTargetId] = useState('');

  useEffect(() => {
    const populateUserList = async () => {
      try {
        const response = await axios.get('/api/v2/users');
        console.log(response);
        setUserList(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    populateUserList();
  }, []);

  useEffect(() => {
    setTargetId(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    console.log(targetId);
  }, [targetId]);

  return (
    <section>
      <h1>Adminboard</h1>
      <label htmlFor='userlist'>
        Choose a user:{' '}
        <select
          name='userlist'
          id='userlist'
          onChange={(e) =>
            setSelectedUser(
              userList.find((user) => user.username === e.target.value)
            )
          }
        >
          <option disabled selected value>
            {' '}
            -- select a user --{' '}
          </option>
          {userList.map((user) => (
            <option key={user._id} defaultValue={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      </label>
      {selectedUser ? (
        <section>
          <p>Username: {selectedUser.username}</p>
          <p>Role: {selectedUser.role}</p>
          <p>Id: {selectedUser._id}</p>
          <p>Active: {selectedUser.active ? 'True' : 'False'}</p>
          <p>Joined: {selectedUser.createdAt}</p>
        </section>
      ) : (
        <></>
      )}
    </section>
  );
};

export default Adminboard;
