import User_Model from '../../database/models/User/index.js'

const User_Controller = {

    register: async (req, res) => {

        const {username, password, email} = req.body
        
        if( await User_Model.findOne().or([{username}, {email}]) ) {
            res.status(400).send("Username or Email are already in use")
        } else {
            await User_Model.create({username, email, password})?
                res.status(200).send("Registered")
                :
                res.status(400).send("Register gone wrong :(")
        }
        
            
    }
    
    
}

export default User_Controller