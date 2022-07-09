var btn = document.getElementById('btn')
var pass = document.getElementById('pass')
var submit = document.getElementById('submit')
var error = document.getElementById('error')

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

btn.addEventListener('click', () => {
  window.location.href = '/login'
})

pass.addEventListener('keyup', () => {
  if (!validate(pass.value)) {
    error.innerHTML = 'Not Acceptable Password'
    submit.setAttribute('disabled', 'true')
  } else {
    error.innerHTML = ''
    submit.removeAttribute('disabled')
  }
})
