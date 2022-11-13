import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error('Not authenticated.')
        // @ts-ignore
        error.statusCode = 401
        throw error
    }
    const token = authHeader.split(' ')[1]
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SECRET_KEY as Secret
        )
        // token was not signed by us
        if (!decodedToken) {
            const error = new Error('Not authenticated.')
            // @ts-ignore
            error.statusCode = 401
            throw error
        }
        // @ts-ignore
        req.userId = decodedToken.userId
    } catch (err) {}
}
