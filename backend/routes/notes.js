const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route1: Get all the notes using GET
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

// Route2: Create new notes using POST , Login required

router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
    //   console.log()
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

// Route3: Update an existing note using: PUT, Login required

router.put('/updatenote/:id', fetchUser, async (req,res)=>{
  const {title,description,tag} = req.body;
  const newNote = {};
  if(title) newNote.title = title
  if(description) newNote.description = description
  if(tag) newNote.tag = tag

  let note = await Note.findById(req.params.id);
  if(!note){
      return res.status(404).send('Not Found')
  }
  if(note.user.toString() !== req.user.id){
      return res.status(401).send('Not Allowed')
  }
  note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
//   res.json(note);
  res.send(note);
})

// Route4 : Delete an existing note using DELETE, Login required

router.delete('/deletenote/:id', fetchUser, async (req,res)=>{
    let note = await Note.findById(req.params.id);
    if(!note){
        return res.status(404).send('Not Found')
    }
    if(note.user.toString() !== req.user.id){
        return res.status(401).send('Not Allowed')
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.send(note);
  })
module.exports = router;
