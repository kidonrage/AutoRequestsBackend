const { Schema, model, Types } = require('mongoose');
const Car = require('./Car');

const schema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  refreshTokens: [ {type: String} ],
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  patronymic: { type: String, required: false },
  mobileNumber: { type: String, required: true },
  type: { type: String, enum : ['passenger','driver'], required: true },
  transportApplications: [ {type: Types.ObjectId, ref: 'TransportApplication'} ],
})


module.exports = model('User', schema)