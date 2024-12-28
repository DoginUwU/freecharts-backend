import express from 'express'
import cors from 'cors'
import { baseRoutes } from './routes/base.route'

const app = express()

app.use(cors())
app.use(express.json())

app.use(baseRoutes)

app.listen(3000, () => {
    console.log(`Listen in http://localhost:${3000}`)
})
