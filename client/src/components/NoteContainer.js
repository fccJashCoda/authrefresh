// import { useState, useEffect } from 'react';
import NoteComoponent from './NoteComponent';

function NoteContainer(props) {
  // const [notes, setNotes] = useState([]);
  const notes = props.notes;

  return (
    <section className='row mt-4'>
      {notes.map((note) => (
        <NoteComoponent note={note} />
      ))}
    </section>
  );
}

export default NoteContainer;
