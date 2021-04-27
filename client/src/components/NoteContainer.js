import { useState, useEffect } from 'react';
import NoteComoponent from './NoteComponent';

function NoteContainer(props) {
  const [notes, setNotes] = useState(props.notes);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNotes(props.notes);
      setTimeout(() => {
        setFetching(false);
      }, 500);
    }, 500);
  }, [props.notes]);

  return (
    <section className='row mt-4'>
      {fetching ? (
        <p>Loading notes...</p>
      ) : (
        <>
          {notes.length > 0 ? (
            <>
              {notes.map((note) => (
                <NoteComoponent note={note} key={note._id} />
              ))}
            </>
          ) : (
            <p>No Notes Found</p>
          )}
        </>
      )}
    </section>
  );
}

export default NoteContainer;
