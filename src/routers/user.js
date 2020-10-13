const express = require('express')
const User = require('../models/user')
const router = new express.Router()


router.post('/user/create', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/user/list', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/user/find/:id', async (req, res) => {
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

router.patch('/user/update/:id', async (req, res) => {
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

router.delete('/user/delete/:id', async (req, res) => {
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

module.exports = router