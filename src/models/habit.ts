import { Schema, model } from 'mongoose'

const HabitSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        habitType: {
            type: Number,
            required: true,
            default: 0,
        }, // types: 0 - total is days for target, 1 - total is attempts for target
        status: {
            type: Number,
            required: true,
            default: 1, // 0-disabled, 1-active, 2-archived
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        daysLog: [
            {
                date: { type: Schema.Types.Date },
            },
        ],
        attemptsLog: [
            {
                date: { type: Schema.Types.Date },
                attempts: { type: Schema.Types.Number },
            },
        ],
    },
    { timestamps: true }
)

export default model('Habit', HabitSchema)
