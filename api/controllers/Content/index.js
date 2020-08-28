import Content_Model from '../../database/models/Content/index.js'
import fs from 'fs'
import axios from 'axios'

const { TMDBAPIBASEURL, TMDBCDNBASEURL, TMDBAPIKEY, PORT, ADRESS } = process.env

const internal_methods = {

    fetch_content_data_from_tmdb_api: async function (content_id) {
        let post_data = {}

        let general_content_query = `${TMDBAPIBASEURL}tv/${content_id}?api_key=${TMDBAPIKEY}&language=en-US`
        let { data: content_data } = await axios.get(general_content_query)

        content_data.seasons = []
        content_data.images = {}

        for (let index = 1; index <= content_data.number_of_seasons; index++) {
            let season_query = `${TMDBAPIBASEURL}tv/${content_id}/season/${index}?api_key=${TMDBAPIKEY}&language=en-US`
            let { data: season_data } = await axios.get(season_query)
            content_data.seasons.push(season_data)
        }

        content_data.images.backdrop_image_url = TMDBCDNBASEURL + content_data.backdrop_path
        content_data.images.poster_image_url = TMDBCDNBASEURL + content_data.poster_path

        let { id, name, overview, seasons, vote_average, images, genres } = content_data
        post_data = { id, name, overview, seasons, vote_average, images, genres }
        post_data.comments = []

        return post_data
    },

    generate_folder_structure_in_disk: function (show_id, seasons) {

        let base_url = './media/' + show_id + "/"

        fs.mkdir(base_url, 0o777, (err) => {
            fs.chmodSync(base_url, fs.constants.S_IRWXO)
            if (err) {
                if (err.errno != -17) console.error(err)
            }

            for (let index = 1; index <= seasons; index++) {
                try {
                    fs.mkdirSync(base_url + index)
                } catch (err) {
                    console.log('folder already exists')
                }
                fs.chmodSync(base_url + index, fs.constants.S_IRWXO)
            }

        })


    },

    process_content_data: function (content) {
        content.seasons.forEach(season => {
            season["poster_image_url"] = season.poster_path
            season["poster_image_url"] = TMDBCDNBASEURL + season.poster_path
            delete season.overview
            delete season._id
            delete season.poster_path

            for (let [, value] of Object.entries(season.episodes)) {

                delete value.guest_stars
                delete value.crew
                delete value.vote_count
                delete value.air_date
                delete value.production_code
                value["still_image_url"] = value.still_path
                value["still_image_url"] = TMDBCDNBASEURL + value.still_image_url
                value["video_url"] = `http://${ADRESS}:${PORT}/api/content/watch/${value.show_id}/${season.season_number}/${value.episode_number}`
                delete value.still_path

            }
        })


        this.generate_folder_structure_in_disk(content.id, content.seasons.length)
        return content
    },

}

const Content_Controller = {

    watch: (req, res) => {

        const { range } = req.headers
        const { show_id, season_number, episode_number } = req.params
        const episode_path = `./media/${show_id}/${season_number}/${episode_number}.mp4`

        fs.stat(episode_path, (err, stats) => {
            if (err) {
                if (err.code == "ENOENT") {

                    let error_stats = fs.statSync("./media/error.mp4")
                    let { size: episode_size } = error_stats

                    let headers = {
                        'Content-Length': episode_size,
                        'Content-Type': 'video/mp4',
                    }

                    let error_video_stream = fs.createReadStream("./media/error.mp4", { start: 0, end: episode_size })
                    res.writeHead(200, headers)
                    error_video_stream.pipe(res)

                }
            } else {
                const { size: episode_size } = stats

                const start = parseInt(range.match(new RegExp(/\d+/g))[0], 10)
                const end = episode_size - 1
                const chunk_size = end - start

                const headers = {
                    'Content-Range': `bytes ${start}-${end - 1}/${episode_size}`,
                    'Content-Type': 'video/mp4',
                    'Content-Length': chunk_size,
                    'Accept-Ranges': 'bytes'
                }

                const stream_chunk = fs.createReadStream(episode_path, { start, end })

                res.writeHead(206, headers)
                stream_chunk.pipe(res)
            }


        })

    },

    post_content: async (req, res) => {
        
        let content_data = await internal_methods.fetch_content_data_from_tmdb_api(req.query.id)
        content_data = internal_methods.process_content_data(content_data)
        if (await Content_Model.findOne({ id: content_data.id })) {
            res.status(404).send('Sorry, we could not create this resource in the server')
        } else {
            const document = await Content_Model.create(content_data)
            res.status(200).send(document)
        }

    },

    get_content_by_id: async (req, res) => {
        const { show_id } = req.params
        const document = await Content_Model.findOne({ id: show_id })
        document ?
            res.status(200).send(document) :
            res.status(404).send('Resource not found :(')
    },

    get_content: async (req, res) => {
        let { genres, name, to, from } = req.query
        if (genres) {
            genres = genres.split(",")
            res.send(await Content_Model.find().where("genres.name").all(genres))
        } else if (name) {
            res.send(await Content_Model.fuzzySearch(name))
        }
        else {
            res.send(await Content_Model.find())
        }
    }
}

export default Content_Controller
