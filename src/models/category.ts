import { Schema, model } from 'mongoose'

const Category = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
)

export default model('Category', Category)
