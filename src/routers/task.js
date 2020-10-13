const express = require('express')
const Task = require('../models/task')
const router = new express.Router()


router.post('/task/create', async (req, res) => {
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

router.get('/task/list', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/task/update/:id', async (req, res) => {
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

router.get('/task/find/:id', async (req, res) => {
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

router.delete('/task/delete/:id', async (req, res) => {
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

module.exports = router