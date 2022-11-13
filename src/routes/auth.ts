import { Router } from 'express'
import { body } from 'express-validator'

import { signupUser } from '../controllers/auth'
import User from '../models/user'

const router = Router()

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .normalizeEmail({ gmail_remove_dots: false })
            .withMessage('Enter a valid email.'),
        body('email').custom((value, { req }) => {
            return User.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject('Email already registered.')
                }
            })
        }),
        body('password')
            .trim()
            .isLength({ min: 8 })
            .withMessage('Password should be atleast 8 characters long'),
        body('name')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Name should be atleast 3 characters long.'),
    ],
    signupUser
)

export default router
