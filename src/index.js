const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()
const port = 3000

app.use(express.json())

app.post('/user/create', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/user/list', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/user/find/:id', async (req, res) => {
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

app.patch('/user/update/:id', async (req, res) => {
    try {
        const allowedFields = ["email", "name", "age"]
        const isValidUpdate = Object.keys(req.body).every((field) => {
            return allowedFields.includes(field)
        })

        if (!isValidUpdate) {
            return res.status(400).send("You are trying to update an invalid field!")
        }

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

app.delete('/user/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(400).send(user)
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/task/create', async (req, res) => {
    const allowedFields = ["title", "description", "finishDate"]
    const isValidUpdate = Object.keys(req.body).every((field) => {
        return allowedFields.includes(field)
    })

    if (!isValidUpdate) {
        return res.status(400).send("You are trying to update an invalid field!")
    }

    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/task/list', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/task/update/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const task = await Task.findOneAndUpdate(
            { _id },
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        )

        if (!task) {
            return res.status(500).send()
        }

        res.status(400).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/task/find/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(500).send()
        }

        res.status(400).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete('/task/delete/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(400).send(task)
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})



app.listen(port, () => {
    console.log(`Server up on port ${port}!`)
})