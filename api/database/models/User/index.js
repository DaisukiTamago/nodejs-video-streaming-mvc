import mongoose from 'mongoose'

const user_schema = new mongoose.Schema({
    username: {required: true, type: String},
    email:  {required: true, type: String},
    img: {type: String},
    password: {required: true, type: String},
    favorites: {required:true, type: Array}
}, {collection: "Users"})

const User_Model = mongoose.model("User", user_schema)
export default User_Model
