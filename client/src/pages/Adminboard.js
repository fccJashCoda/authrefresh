import { useState, useEffect } from 'react';
import axios from 'axios';

import useForm from '../hooks/useForm';

// /api/v2/users/
// /api/v2/users/:id
const Adminboard = () => {
  const [userList, setUserList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
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
        setFilteredList(response.data);
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

  useEffect(() => {
    setFilteredList(
      userList.filter((user) => user.username.startsWith(values.pattern))
    );
  }, [values.pattern]);

  return (
    <section>
      <h1>Adminboard</h1>

      <section class='container'>
        <form>
          <div class='mb-3'>
            <label for='exampleInputEmail1' class='form-label'>
              User
            </label>
            <input
              type='text'
              class='form-control'
              name='pattern'
              id='exampleInputEmail1'
              aria-describedby='emailHelp'
              value={values.pattern}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </form>

        <table class='table table-dark table-striped table-hover'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Username</th>
              <th scope='col'>Id</th>
              <th scope='col'>Joined</th>
              <th scope='col'>Role</th>
            </tr>
          </thead>
          <tbody>
            {/* {userList.map((user, index) => ( */}
            {filteredList.map((user, index) => (
              <tr
                style={{ cursor: 'pointer' }}
                onClick={() => console.log(user.username)}
              >
                <th scope='row'>{index + 1}</th>
                <td colspan='1'>{user.username}</td>
                <td>{user._id}</td>
                <td>{user.createdAt}</td>
                {/* <td>{user.role}</td> */}
                {user.role === 'user' ? (
                  <td>
                    <span class='badge bg-primary'>{user.role}</span>
                  </td>
                ) : (
                  <td>
                    <span class='badge bg-success'>{user.role}</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default Adminboard;
