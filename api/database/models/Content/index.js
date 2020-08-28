import mongoose from 'mongoose'
import mongoose_fuzzy_searching from 'mongoose-fuzzy-searching'

const Content_Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    overview: { type: String, required: true },
    seasons: { type: Array, required: true },
    genres: { type: Array, required: true },
    vote_average: { type: Number, required: true },
    images: { type: Object, required: true },
    comments: { type: Array }
}, { collection: "Content" })

Content_Schema.index({ name: 'text' })
Content_Schema.plugin(mongoose_fuzzy_searching, { fields: ['name'] })

const Content_Model = mongoose.model('Content', Content_Schema)

export default Content_Model