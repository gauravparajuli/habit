import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { Error } from 'mongoose'

import Category from '../models/category'

export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await Category.find({ user: req.userId }) // only show post of user
        res.status(200).json({ data: categories })
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const getCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const catId = req.params.catId
    try {
        const instance = await Category.findById(catId)
        if (!instance) {
            return res.status(404).json({
                message: `category with id of ${catId} was not found.`,
            })
        }

        // only allow access if the user owns this resource
        if (!(instance.user.toString() === req.userId)) {
            return res
                .status(403)
                .json({ message: 'you do not own this resource.' })
        }

        res.status(200).json({ data: instance })
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error('input validation failed.')
            //@ts-ignore
            error.statusCode = 422
            //@ts-ignore
            error.data = errors.array()
            throw error
        }
        const name = req.body.name
        const instance = new Category({ name, user: req.userId })
        instance.save()
        res.status(200).json({ data: instance })
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const catId = req.params.catId
    try {
        const instance = await Category.findById(catId)
        if (!instance) {
            return res.status(404).json({
                message: `category with id of ${catId} was not found.`,
            })
        }

        // only allow access if the user owns this resource
        if (!(instance.user.toString() === req.userId)) {
            return res
                .status(403)
                .json({ message: 'you do not own this resource.' })
        }

        instance!.delete()
        res.status(204).json({})
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const catId = req.params.catId
    const name = req.body.name
    try {
        // check if we requested item exits
        const instance = await Category.findById(catId)
        if (!instance) {
            return res.status(404).json({
                message: `category with id of ${catId} was not found.`,
            })
        }

        // only allow access if the user owns this resource
        if (!(instance.user.toString() === req.userId)) {
            return res
                .status(403)
                .json({ message: 'you do not own this resource.' })
        }

        // make sure input is validated
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error('input validation failed.')
            //@ts-ignore
            error.statusCode = 422
            //@ts-ignore
            error.data = errors.array()
            throw error
        }

        // item exits and input is validated, now update db
        instance!.name = name
        instance!.save()
        res.status(200).json({ data: instance })
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}
