import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function NoteComponent(props) {
  const [showing, setShowing] = useState(true);
  const note = props.note;

  const deleteNote = async () => {
    const token = localStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    try {
      const response = await fetch(`/api/v1/notes/${note._id}`, options);
      if (response.status === 200) {
        setShowing(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {showing && (
        <div className='col-6'>
          <div className='card text-white border-primary mb-3'>
            <div className='card-header d-flex d-flex justify-content-between align-items-center'>
              <span>{note.createdAt}</span>
              <span className='btn btn-info' onClick={() => deleteNote()}>
                🧨
              </span>
            </div>
            <div className='card-body'>
              <h4 className='card-title'>{note.title}</h4>
              <ReactMarkdown className='card-text'>{note.text}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteComponent;
