const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()
const port = 3000

app.use(express.json())

app.post('/new-user', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/user/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).send("No user with this Id!")
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.patch('/update-user/:id', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        )

        if (!user) {
            res.status(400).send()
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/new-task', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.listen(port, () => {
    console.log(`Server up on port ${port}!`)
})