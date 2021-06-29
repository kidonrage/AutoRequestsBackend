const carsMock = require('../mocks/carsMock')

const getPublicDriverObjectFromUser = async (user) => {
  if (user.type !== 'driver') {
    throw new Error('Пытаемся получить объект водителя от пользователя другого типа')
  }

  const { _id, lastName, firstName, patronymic, mobileNumber} = user

  const car = carsMock[_id]

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