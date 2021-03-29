import { useState, useEffect } from 'react';

function Dashboard() {
  const [user, setUser] = useState({});

  const logout = () => {
    window.location.href = '/login';
  };

  const addNotes = () => {};
  const deleteNotes = () => {};
  const getNotes = async () => {
    const response = await fetch('/api/v1/notes', {
      Authorization: `bearer ${localStorage.getItem('token')}`,
    });
    const result = await response.json();
    console.log(result);
  };

  useEffect(() => {
    const auth = async () => {
      const response = await fetch('/auth', {
        headers: {
          Authorization: `bearer ${localStorage.getItem('token')}`,
        },
      });
      const auth = await response.json();
      if (auth.user) {
        setUser(auth.user);
        getNotes();
        console.log(user);
      } else {
        logout();
      }
    };
    auth();
  }, []);

  return (
    <section className='p-4'>
      <h1>Dashboard</h1>
      <h3>Getting user information...</h3>
      {user.username && <h3>Welcome, {user.username}!</h3>}
      <button className='btn btn-warning mt-5'>Logout</button>
      <button className='btn btn-info mt-5'>Toggle Form</button>
      <form>
        <div className='mb-3'>
          <label htmlFor='title' className='form-label'>
            Title
          </label>
          <input
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
            required
            className='form-control'
            id='note'
            placeholder='Enter your note...'
          ></textarea>
        </div>
        <button type='submit' className='btn btn-primary'>
          Post note
        </button>
      </form>
      <section className='row mt-4'>
        <div className='col-6'>
          <div className='card text-white border-primary mb-3'>
            {/* <div className="card-header d-flex d-flex justify-content-between align-items-center"><span>{{note.createdAt}}</span><span className="btn btn-info">🧨</span></div> */}
            <div className='card-body'>
              {/* <h4 className="card-title">{{note.title}}</h4> */}
              <p className='card-text' v-html='renderMarkdown(note.text)'></p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
