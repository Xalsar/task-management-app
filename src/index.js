const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const app = express()
const port = 3000

app.use(express.json())

app.post('/users', (req, res) => {
    res.send('Testing perfect!')
})

app.post('/new-user', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.listen(port, () => {
    console.log(`Server up on port ${port}!`)
})