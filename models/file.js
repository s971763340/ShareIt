const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//this is done for how the file will be stored on the database
const fileSchema = new Schema({
    filename: {type: String,require:true},
    path: {type: String,require:true},
    size: {type: Number,require:true},
    uuid: {type: String,require:true}, //id generated for every file
    sender: {type: String,require:false}, //email of sender
    receiver: {type: String,require:false},
},{ timestamps:true});

module.exports = mongoose.model('File',fileSchema);