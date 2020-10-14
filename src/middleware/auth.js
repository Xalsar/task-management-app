const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Auth')
        const decoded = jwt.verify(token, '-u+G_P]R,J3.ha7Hecq}.,yqn{.}~AFJQXu{3Hv})nCd[5a6hMN-AQk')
        const user = await User.findOne({ 'tokens.token': token, _id: decoded._id })

        if (!user) {
            throw new Error()
        }

        req.user = user

        next()
    } catch (e) {
        res.status(401).send("Error: User not authentified")
    }
}

module.exports = auth