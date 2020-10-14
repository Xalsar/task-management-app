const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/user/create', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(500).send(error)
    }
})

// router.get('/user/list', async (req, res) => {
//     try {
//         const users = await User.find()
//         res.status(200).send(users)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

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

router.patch('/user/update', auth, async (req, res) => {
    try {
        const user = req.user
        const updates = Object.keys(req.body)
        const allowedFields = ["email", "name", "age"]
        const isValidUpdate = updates.every((field) => {
            return allowedFields.includes(field)
        })

        if (!isValidUpdate) {
            return res.status(500).send("You are trying to update an invalid field!")
        }

        if (!user) {
            return res.status(500).send()
        }

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/user/delete', auth, async (req, res) => {
    try {
        const user = req.user
        await user.remove()

        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
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