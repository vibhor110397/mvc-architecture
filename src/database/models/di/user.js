const { Schema, model } = require('mongoose')

const userModel = Schema({
    name: { type: Schema.Types.ObjectId, required: true },
    role: { type: Number, required: true },
    updatedAt: { type: Date, required: true }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = model('userModel', userModel)
