import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useHistory } from "react-router-dom";

const Notes = (props) => {
    const {showAlert} = props;
  const context = useContext(noteContext);
  let { notes, getNotes ,editNote} = context;
  let history = useHistory();

  useEffect(() => {
      if(localStorage.getItem('token')){
          getNotes();
        }
    else{
        history.push('/login');
    }
    // eslint-disable-next-line
  }, []);

  const [note, setNote] = useState({id:"", etitle: "", edescription: "", etag: "" });
  const ref = useRef(null);
  const refClose = useRef(null);

  const updatenote = (currentNote) => {
    ref.current.click();
    setNote({
      id : currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag
    });
    
  };

  const handleClick = (e) => {
    //   console.log('Editing the note', note)
      editNote(note.id , note.etitle, note.edescription, note.etag)
      refClose.current.click();
      props.showAlert("Note edited successfully","success");
    };
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert={showAlert}/>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    minLength={5}
                    required
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    minLength={5}
                    required
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    value={note.etag}
                    name="etag"
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleClick}
                className="btn btn-primary"
                disabled={note.etitle.length<5 || note.edescription.length<5}
              >
                Edit Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3 mx-3">
        <h2>Your notes</h2>
        <div className="container">
            {notes.length===0 && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return (
            <Noteitem key={note._id} note={note} showAlert={showAlert} updatenote={updatenote} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
