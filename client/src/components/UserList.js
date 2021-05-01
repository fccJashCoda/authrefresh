import { useState, useEffect } from 'react';
import InputComponent from './InputComponent';

import useForm from '../hooks/useForm';

const UserList = (props) => {
  const [filteredList, setFilteredList] = useState(props.userList || []);
  const [targetId, setTargetId] = useState('');

  const { values, handleChange } = useForm({
    initialValues: {
      pattern: '',
    },
  });

  const handleClick = (id) => {
    props.action(id);
    console.log(id);
  };

  useEffect(() => {
    setFilteredList(props.userList);
  }, [props.userList]);

  useEffect(() => {
    setFilteredList(
      props.userList.filter((user) => user.username.startsWith(values.pattern))
    );
  }, [values.pattern]);

  return (
    <>
      <form>
        <div class='mb-3'>
          <label for='exampleInputEmail1' class='form-label'>
            Filter users:
          </label>
          <InputComponent
            type='text'
            class='form-control'
            name='pattern'
            id='exampleInputEmail1'
            aria-describedby='emailHelp'
            value={values.pattern}
            action={handleChange}
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
          {filteredList.map((user, index) => (
            <tr
              style={{ cursor: 'pointer' }}
              // onClick={() => console.log(user.username)}
              onClick={() => handleClick(user._id)}
            >
              <th scope='row'>{index + 1}</th>
              <td colspan='1'>{user.username}</td>
              <td>{user._id}</td>
              <td>{user.createdAt}</td>
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
    </>
  );
};

export default UserList;
