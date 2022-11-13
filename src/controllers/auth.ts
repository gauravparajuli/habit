import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import jwt, { Secret } from 'jsonwebtoken'
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

    if (!errors.isEmpty()) {
        const error = new Error('Input validation failed.')
        // @ts-ignore
        error.statusCode = 422
        // @ts-ignore
        error.data = errors.array()
        throw error
    }

    try {
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

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)

    const email = req.body.email
    const password = req.body.password

    if (!errors.isEmpty()) {
        const error = new Error('Input validation failed.')
        // @ts-ignore
        error.statusCode = 422
        // @ts-ignore
        error.data = errors.array()
        throw error
    }
    
    try {

        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).json({ message: 'Invalid username or password.' })
        }
        // check for password
        const pwMatch = await bcrypt.compare(password, user!.password)
        if (!pwMatch) {
            res.status(401).json({ message: 'Invalid username or password.' })
        }

        // user email and password verified, generate a token now
        const token = jwt.sign(
            {
                email: user!.email,
                userId: user!._id,
            },
            process.env.TOKEN_SECRET_KEY as Secret,
            {
                expiresIn: '168h',
            }
        )

        res.status(200).json({ userId: user!.id, token })
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}
