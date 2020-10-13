const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    email: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                return new Error("Email not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;

            const validPassword = regExp.test(value);

            if (!validPassword) {
                return new Error("Password not strong enought!")
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age can not be a negative number!")
            }
        }
    },
})

module.exports = User

