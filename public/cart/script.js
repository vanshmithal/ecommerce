var popup = document.getElementsByClassName('popup')[0]

var userCart = []

function getUserCart(callback) {
  var request = new XMLHttpRequest()
  request.open('GET', '/getUserCart')
  request.send()
  request.addEventListener('load', () => {
    var data = JSON.parse(request.responseText)
    var cart = JSON.parse(data.data)
    callback(cart)
  })
}

getUserCart((cart) => {
  userCart = cart
  // console.log(userCart)
  //add event listeners...
  qtyBtnLoop()
  // console.log('ready')
})

function qtyBtnLoop() {
  var minusBtns = document.querySelectorAll('.minus-qty')
  var plusBtns = document.querySelectorAll('.plus-qty')
  var deleteBtns = document.querySelectorAll('.delete-item')
  var viewBtns = document.querySelectorAll('.view-item')

  for (var i = 0; i < minusBtns.length; i++) {
    minusBtns[i].addEventListener('click', (e) => {
      var productId = e.target.parentNode.parentNode.getAttribute('key')
      var qtyElement = e.target.parentNode.children[1]
      if (qtyElement.innerHTML == 1) {
        //use delete btn...
      } else {
        var request = new XMLHttpRequest()
        request.open('PATCH', `/shoppingCart/${productId}`)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify({ action: 'minus' }))
        request.addEventListener('load', () => {
          if (request.status === 200) {
            console.log(request.responseText)
            qtyElement.innerHTML -= 1
          }
        })
      }
    })
    plusBtns[i].addEventListener('click', (e) => {
      var productId = e.target.parentNode.parentNode.getAttribute('key')
      var qtyElement = e.target.parentNode.children[1]
      // if(qtyElement.innerHtml === 1){
      //   return
      // }
      var request = new XMLHttpRequest()
      request.open('PATCH', `/shoppingCart/${productId}`)
      request.setRequestHeader('Content-Type', 'application/json')
      request.send(JSON.stringify({ action: 'plus' }))
      request.addEventListener('load', () => {
        if (request.status === 200) {
          qtyElement.innerHTML = ~~qtyElement.innerHTML + 1
        } else if (request.status === 404) {
          var btns = e.target.parentNode.querySelectorAll('button')
          var qty = qtyElement.innerHTML
          btns[0].setAttribute('disabled', 'true')
          btns[1].setAttribute('disabled', 'true')
          qtyElement.innerHTML = 'MAX!'
          setTimeout(() => {
            btns[0].removeAttribute('disabled')
            btns[1].removeAttribute('disabled')
            qtyElement.innerHTML = qty
          }, 2000)
        }
      })
    })
    deleteBtns[i].addEventListener('click', (e) => {
      var productId = e.target.parentNode.getAttribute('key')
      var request = new XMLHttpRequest()
      request.open('DELETE', `/shoppingCart/${productId}`)
      request.send()
      request.addEventListener('load', () => {
        if (request.status === 200) {
          e.target.parentNode.remove()
        }
      })
    })
    viewBtns[i].addEventListener('click', (e) => {
      var productId = e.target.getAttribute('key')
      var request = new XMLHttpRequest()
      request.open('GET', `/shoppingCart/${productId}`)
      request.send()
      request.addEventListener('load', () => {
        if (request.status === 200) {
          var popupEjs = request.responseText
          popup.innerHTML = popupEjs
          popup.style['height'] = screen.height + 30
          popup.classList.remove('hidden')
          popup.children[0].children[0].addEventListener('click', closePopup)
        }
      })
    })
  }
}

const closePopup = () => {
  popup.classList.add('hidden')
  popup.children[0].children[0].removeEventListener('click', closePopup)
  popup.innerHTML = ''
}
