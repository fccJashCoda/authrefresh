import { useState, useEffect } from 'react';
import Joi from 'joi';
import NoteContainer from '../components/NoteContainer';

const schema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  text: Joi.string().trim().required(),
});

function Dashboard() {
  const [user, setUser] = useState({});
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const addNote = async (e) => {
    e.preventDefault();

    if (validNote()) {
      const token = localStorage.getItem('token');
      const payload = {
        title,
        text,
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
    const valid = schema.validate({ title, text });

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
    console.log('form: ', showForm);
  };

  useEffect(() => {
    setErrorMessage('');
  }, [title, text]);

  useEffect(() => {
    const auth = async () => {
      const token = await localStorage.getItem('token');
      const response = await fetch('/auth', {
        method: 'GET',
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      const auth = await response.json();
      if (auth.user) {
        setUser(auth.user);
        getNotes();
      } else {
        logout();
      }
    };
    auth();
  }, []);

  return (
    <section className='p-4'>
      <h1>Dashboard</h1>
      {user.username ? (
        <h3>Welcome, {user.username}!</h3>
      ) : (
        <h3>Getting user information...</h3>
      )}
      <button className='btn btn-warning mt-5' onClick={logout}>
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
            <label htmlFor='title' className='form-label'>
              Title
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              required
              ype='text'
              className='form-control'
              id='title'
              aria-describedby='titleHelp'
              placeholder='Enter your title'
            />
            <div id='titleHelp' className='form-text'>
              Enter a title for your note
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor='note' className='form-label'>
              Note
            </label>
            <textarea
              onChange={(e) => setText(e.target.value)}
              required
              rows='4'
              className='form-control'
              id='note'
              placeholder='Enter your note...'
            ></textarea>
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