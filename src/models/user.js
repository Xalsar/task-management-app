const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
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

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, '-u+G_P]R,J3.ha7Hecq}.,yqn{.}~AFJQXu{3Hv})nCd[5a6hMN-AQk')

    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    return {
        _id: user._id,
        email: user.email,
        name: user.name,
        age: user.age
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User

