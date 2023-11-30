const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')


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
      validator: function (value) {
        return validator.isEmail(value);
      },
      massage: "please enter your email address"
    }


  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
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
  profile: { type: String },
  tokens: [{
    token: String
  }]
});


StudentSchema.pre("save", async function (next) {
  const student = this;
  if (student.isModified("password")) {
    student.password = await bcrypt.hash(student.password, 12)
  }
  if (!student.tokens || !Array.isArray(student.tokens)) {
    student.tokens = [];
  } 
  next();
})

StudentSchema.statics.findByCredentials = async (email, password) => {
  const student = await Student.findOne({ email });

  console.log(student)
  console.log(password)
  console.log(student.password)   

  if (!student) {
    throw new Error('Unable to login. User not found.');
  }

  const isMatch = await bcrypt.compare(password, student.password)

  console.log(isMatch)

  if (!isMatch) {
    throw new Error('Unable to login. Incorrect password.');
  }

  return student;
};

StudentSchema.methods.generateAuthToken = async function () {
  const student = this;
  const token =  jwt.sign({_id : student._id.toString()},"mysecret")
   student.tokens = student.tokens.concat({token})
   await student.save()

   console.log("admin.tokens")

   return  token;   

}

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
