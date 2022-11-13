import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import bcrypt from 'bcryptjs'

import User from '../models/user'

export const signupUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Input validation failed.')
            // @ts-ignore
            error.statusCode = 422
            // @ts-ignore
            error.data = errors.array()
            throw error
        }

        const hashedPw = await bcrypt.hash(
            password,
            process.env.BCRYPT_SALT as string
        )
        const user = new User({ name, email, password: hashedPw })
        user.save()
        res.status(201).json({
            userId: user._id,
        })
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}
