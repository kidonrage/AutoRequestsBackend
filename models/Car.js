const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  driver: { type: Types.ObjectId, ref: 'User', unique: true, required: true },
  name: { type: String, required: true },
  govNumber: { type: String, unique: true, required: true },
})

module.exports = model('Car', schema)