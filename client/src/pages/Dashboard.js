import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../hooks/UserContext';
import Joi from 'joi';
import NoteContainer from '../components/NoteContainer';
import InputComponent from '../components/InputComponent';
import useLogout from '../hooks/useLogout';
import useForm from '../hooks/useForm';

const schema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  text: Joi.string().trim().required(),
});

function Dashboard() {
  const { user } = useContext(UserContext);
  const { values, handleChange } = useForm({
    initialValues: {
      title: '',
      text: '',
    },
  });
  const { logoutUser } = useLogout();
  const [notes, setNotes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  const handleLogout = () => {
    logoutUser();
  };

  const addNote = async (e) => {
    e.preventDefault();

    if (validNote()) {
      const token = localStorage.getItem('token');
      const payload = {
        title: values.title,
        text: values.text,
      };

      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(payload),
      };

      try {
        const response = await fetch('/api/v1/notes', options);
        const result = await response.json();
        setNotes([result.note, ...notes]);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const validNote = () => {
    // const valid = schema.validate({ title, text });
    const valid = schema.validate(values);

    if (!valid.error) return true;

    setErrorMessage(valid.error);
    return false;
  };

  const getNotes = async () => {
    const token = await localStorage.getItem('token');
    const response = await fetch('/api/v1/notes', {
      method: 'GET',
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    const result = await response.json();
    setNotes(result);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    setErrorMessage('');
  }, [values]);

  return (
    <section className='p-4 container'>
      <h1>Dashboard</h1>
      {user ? (
        <h3>Welcome, {user.username}!</h3>
      ) : (
        <h3>Getting user information...</h3>
      )}
      <button className='btn btn-warning mt-5' onClick={handleLogout}>
        Logout
      </button>
      <button className='btn btn-info mt-5' onClick={toggleForm}>
        Toggle Form
      </button>
      {errorMessage && (
        <div className='alert alert-danger' role='alert'>
          {errorMessage}
        </div>
      )}
      {showForm && (
        <form>
          <div className='mb-3'>
            <InputComponent
              name='title'
              title='Title'
              placeholder='Enter your title'
              action={handleChange}
              message='Enter a title for your note'
              value={values.title}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='note' className='form-label'>
              Note
            </label>
            <textarea
              onChange={handleChange}
              required
              rows='4'
              className='form-control'
              id='note'
              name='text'
              placeholder='Enter your note...'
              value={values.text}
            ></textarea>
            <small id={`noteHelp`} className='form-text text-muted'>
              Enter the text description of you note.
            </small>
          </div>
          <button
            onClick={(e) => addNote(e)}
            type='submit'
            className='btn btn-primary'
          >
            Post note
          </button>
        </form>
      )}
      <NoteContainer notes={notes} />
    </section>
  );
}

export default Dashboard;
