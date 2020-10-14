const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/user/create', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.generateAuthToken()
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error)
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

router.get('/user/me', auth, async (req, res) => {
    const user = req.user

    if (!user) {
        res.status(500).send(user)
    }

    res.status(200).send(user)
})

router.get('/user/find/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(500).send("No user with this Id!")
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/user/update/:id', async (req, res) => {
    try {
        const allowedFields = ["email", "name", "age"]
        const isValidUpdate = Object.keys(req.body).every((field) => {
            return allowedFields.includes(field)
        })

        if (!isValidUpdate) {
            return res.status(500).send("You are trying to update an invalid field!")
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
            res.status(500).send()
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/user/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(500).send(user)
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        await user.generateAuthToken()
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        const user = req.user
        const tokens = user.tokens.filter((token) => token.token !== req.header('Auth'))

        user.tokens = tokens
        await user.save()

        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router