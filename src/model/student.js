const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 const validator = require('validator');


const StudentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: 'John'

  },
  email: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(value) {
        return validator.isEmail(value);
      },
      massage :"please enter your email address"
    }
    

  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(value) {
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 0,
          minSymbols: 1,
          returnScore: false 
        });
        
      },
      message:
        'Password must be at least 8 characters with at least one uppercase and lowercase letter, and one special character (@#$%&).'
      

    }
  },
  profile: { type: String }

});



// StudentSchema.statics.login = async function (email) {
//   if (!email) {
//     throw new Error("Please enter email address");
//   }

//   email = email.trim();
//   if (!validator.isEmail(email)) {
//     throw new Error("Please enter a valid email address");
//   }
//   return email;
// };



const Students = mongoose.model('Student', StudentSchema);
module.exports = Students;
