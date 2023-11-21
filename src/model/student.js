const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: 'John'

  },
  email: {
    type: String,
    required: true,

  },
  password: {
    type: String,
    required: true
  },
  profile: { type: String }

});



const Students = mongoose.model('Student', StudentSchema);
module.exports = Students;
