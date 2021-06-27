const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  date: { type: String, required: true },
  timeRange: { type: String, required: true },
  address: { type: String, required: true },
  comment: { type: String, required: false },
  passenger: [ {type: Types.ObjectId, ref: 'User', required: true} ],
  driver: [ {type: Types.ObjectId, ref: 'User', required: true} ],
})

module.exports = model('TransportApplication', schema)