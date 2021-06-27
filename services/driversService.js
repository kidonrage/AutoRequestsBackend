const Car = require("../models/Car");

const getPublicDriverObjectFromUser = async (user) => {
  if (user.type !== 'driver') {
    throw new Error('Пытаемся получить объект водителя от пользователя другого типа')
  }

  const car = await Car.findOne({
    driver: user._id
  })

  const { _id, lastName, firstName, patronymic, mobileNumber} = user

  return {
    _id, 
    lastName, 
    firstName, 
    patronymic, 
    mobileNumber,
    car
  }
};

module.exports = {
  getPublicDriverObjectFromUser
}