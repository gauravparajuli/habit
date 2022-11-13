import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import mongoose from 'mongoose'

import authRoutes from './routes/auth'

const app = express()

// register middlewares here
app.use(bodyParser.json())
app.use(helmet())

// register routes here
app.use('/auth', authRoutes)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const status = error.statusCode || 500
    // @ts-ignore
    const message = error.message
    // @ts-ignore
    const data = error.data
    res.status(status).json({ message, data })
})

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB}?tls=true&authSource=admin`
    )
    .then((result) => {
        app.listen(process.env.PORT || 3000)
        console.log(`Server running at port ${process.env.PORT}`)
    })
    .catch((err) => console.log(err))
