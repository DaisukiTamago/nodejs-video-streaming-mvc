import express from 'express'
import Content_Controller from '../../controllers/Content/index.js'

const Content_Router = express.Router()

Content_Router.get('/:show_id', Content_Controller.get_content_by_id)
Content_Router.get('/', Content_Controller.get_content)
Content_Router.get('/watch/:show_id/:season_number/:episode_number', Content_Controller.watch)
Content_Router.post("/", Content_Controller.post_content)

export default Content_Router