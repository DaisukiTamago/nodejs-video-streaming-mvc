import express from 'express'
import User_Controller from '../../controllers/User/index.js'

const User_Router = express.Router()

User_Router.get('/:user_id', (req, res) => {
    console.log(req.params)
    res.send(req.params)
})  

User_Router.post('/register', User_Controller.register)

export default User_Router