const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
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

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Log in invalid, email or password may be wrong')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Log in invalid, email or password may be wrong')
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User

