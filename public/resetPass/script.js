var pass = document.getElementById('pass')
var confirmPass = document.getElementById('confirm-pass')
var error = document.getElementById('error')
var success = document.getElementById('success')
var submit = document.getElementById('submit')

const validate = (str) => {
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

pass.addEventListener('keyup', () => {
  if (!validate(pass.value)) {
    submit.setAttribute('disabled', 'true')
    error.innerHTML = 'Not Acceptable Password'
    success.innerHTML = ''
  } else {
    submit.removeAttribute('disabled')
    error.innerHTML = ''
    success.innerHTML = 'Acceptable Password'
  }
})

confirmPass.addEventListener('keyup', () => {
  if (confirmPass.value !== pass.value) {
    submit.setAttribute('disabled', 'true')
    error.innerHTML = 'Passwords Mismatch'
    success.innerHTML = ''
  } else {
    submit.removeAttribute('disabled')
    error.innerHTML = ''
    success.innerHTML = 'Passwords Match'
  }
})
