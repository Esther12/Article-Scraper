var mongoose = require("mongoose");

//Save a refreance to the Schema constructor
var Schema = mongoose.Schema;

//Using the Schema constructor to create a new NoteSchema obj

var NoteSchema = new Schema({
    articles  : {
        type :  Schema.Types.ObjectId,// it links to the Article collection
        ref : "Article"   
    },
    comments : {
        type : String,
        required :true
    }
})

var Note = mongoose.model("Node", NoteSchema);

module.exports = Note;

