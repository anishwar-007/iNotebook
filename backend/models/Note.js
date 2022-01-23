const mongoose = require('mongoose')
const {Schema} = mongoose;

const NotesSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"General"
    },
    date:{
        type:Date,
        default: Date.now
    }
});

const Note =  mongoose.model('notes',NotesSchema);
module.exports = Note;