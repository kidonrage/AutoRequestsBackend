const getDateFromString = (dateString) => {
  return new Date(dateString)
}

const getDayIndexFromDateString = (dateString) => {
  const parsedDate = getDateFromString(dateString)

  const day = parsedDate.getDay()

  if (day === NaN) {
    throw new Error('Can\'t parse date')
  }

  return day - 1
}

module.exports = {
  getDayIndexFromDateString
}