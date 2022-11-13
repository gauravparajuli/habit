import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import mongoose from 'mongoose'

import authRoutes from './routes/auth'
import categoryRoutes from './routes/category'
import habitRoutes from './routes/habit'

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

// register middlewares here
app.use(bodyParser.json())
app.use(helmet())

// register routes here
app.use('/auth', authRoutes)
app.use('/habit', habitRoutes)
app.use('/category', categoryRoutes)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const status = error.statusCode || 500
    // @ts-ignore
    const message = error.message
    // @ts-ignore
    const data = error.data
    console.log(error)
    res.status(status).json({ message, data })
    next()
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
