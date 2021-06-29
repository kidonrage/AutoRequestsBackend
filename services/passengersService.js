const getPublicPassengerObjectFromUser = async (user) => {
  if (user.type !== 'passenger') {
    throw new Error('Пытаемся получить объект пассажира от пользователя другого типа')
  }
  
  const { _id, lastName, firstName, patronymic, mobileNumber} = user

  return {
    _id, 
    lastName, 
    firstName, 
    patronymic, 
    mobileNumber,
  }
};

module.exports = {
  getPublicPassengerObjectFromUser
}