const getDateFromString = (dateString) => {
  return new Date(dateString)
}

const getDayIndexFromDate = (date) => {
  const day = date.getDay()

  if (day === NaN) {
    throw new Error('Can\'t parse date')
  }

  return day - 1
}

const getDayIndexFromDateString = (dateString) => {
  const parsedDate = getDateFromString(dateString)

  return getDayIndexFromDate(parsedDate)
}

module.exports = {
  getDayIndexFromDateString,
  getDayIndexFromDate,
  getDateFromString
}