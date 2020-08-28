import express from 'express'

import Content_Router from './Content/index.js'
import User_Router from './User/index.js'

const router = express.Router()

router.use('/content', Content_Router)
router.use('/user', User_Router)

export default router