import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/user'

export const signupUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    const hashedPw = await bcrypt.hash(
        password,
        process.env.BCRYPT_SALT as string
    )
    const user = new User({ name, email, password: hashedPw })
    user.save()
    res.status(201).json({
        userId: user._id,
    })
}
