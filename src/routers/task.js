const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/task/create', auth, async (req, res) => {
    const allowedFields = ["title", "description", "finishDate", "owner"]
    const isValidUpdate = Object.keys(req.body).every((field) => {
        return allowedFields.includes(field)
    })

    if (!isValidUpdate) {
        return res.status(500).send("You are trying to update an invalid field!")
    }

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/task/list', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/task/update/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        
        const updates = Object.keys(req.body)
        const allowedFields = ["title", "description", "finishDate"]
        const isValidUpdate = updates.every((field) => {
            return allowedFields.includes(field)
        })

        if (!isValidUpdate) {
            return res.status(500).send("You are trying to update an invalid field!")
        }

        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(500).send()
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.status(400).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/task/find/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.find({
            _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(500).send()
        }

        res.status(500).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/task/delete/:id', auth, async (req, res) => {
    try {
        const task = await Task.find({
            _id: req.params._id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(500).send(task)
        }

        await task.delete()

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router