import ReactMarkdown from 'react-markdown';

function NoteComponent(props) {
  const note = props.note;

  return (
    <div className='col-6' key={note._id}>
      <div className='card text-white border-primary mb-3'>
        <div className='card-header d-flex d-flex justify-content-between align-items-center'>
          <span>{note.createdAt}</span>
          {/* <span className='btn btn-info' onClick={() => deleteNote(note._id)}>
            🧨
          </span> */}
        </div>
        <div className='card-body'>
          <h4 className='card-title'>{note.title}</h4>
          <ReactMarkdown className='card-text'>{note.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default NoteComponent;
