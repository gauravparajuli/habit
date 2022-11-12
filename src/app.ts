import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'

const app = express()

// register middlewares here
app.use(bodyParser.json())
app.use(helmet())

const PORT = +process.env.PORT! || 3000
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})
