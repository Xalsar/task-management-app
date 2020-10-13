const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    finishDate: {
        type: Date
    }
})

module.exports = Task