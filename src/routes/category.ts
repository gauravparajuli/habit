import { Router } from 'express'
import { body } from 'express-validator'

import isAuth from '../middlewares/is-auth'

import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/category'

const router = Router()

router.get('/', isAuth, getCategories)

router.get('/:catId/', isAuth, getCategory)

router.post(
    '/',
    isAuth,
    [
        body('name')
            .isLength({ min: 4 })
            .withMessage('category name should be atleast 4 characters long.'),
    ],
    createCategory
)

router.put(
    '/:catId/',
    isAuth,
    [
        body('name')
            .isLength({ min: 4 })
            .withMessage('category name should be atleast 4 characters long.'),
    ],
    updateCategory
)

router.delete('/:catId/', isAuth, deleteCategory)

export default router
