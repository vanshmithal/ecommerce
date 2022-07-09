module.exports = (str) => {
  if (
    /\d/.test(str) &&
    /[a-z]/.test(str) &&
    /[A-Z]/.test(str) &&
    str.length > 7
  ) {
    return true
  }
  return false
}
