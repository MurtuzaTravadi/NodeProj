let mongoose = require('mongoose')
let validator = require('validator')

//TODO Put validation for every field.

let userSchema = new mongoose.Schema({
    email: { type: String,
    required: true,
    unique: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
    password : String,
    firstName : String,
    lastName : String,
    dateOfBirth : Date,
    enteredBy : Number,
    enteredDate : Date,
    modifiedBy : Number,
    modifiedDate : Date,
    isActive : Boolean,
    isDeleted : Boolean
  })


  module.exports = mongoose.model('User', userSchema)