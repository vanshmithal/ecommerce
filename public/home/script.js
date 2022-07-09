var loadMore = document.getElementById('loadMore')
var cartLength = document.getElementById('cartLength')
var products = []
var userCart = []

function getUserCart(callback) {
  var request = new XMLHttpRequest()
  request.open('GET', '/getUserCart')
  request.send()
  request.addEventListener('load', () => {
    if (request.status === 200) {
      var data = JSON.parse(request.responseText)
      var cart = JSON.parse(data.data)
      callback(cart)
    } else {
      callback(null)
    }
  })
}

loadMore.addEventListener('click', () => {
  var count = document.getElementsByClassName('cont')[0].children.length
  var request = new XMLHttpRequest()
  request.open('GET', `/getNextProducts/${count}`)
  request.send()
  request.addEventListener('load', () => {
    var data = JSON.parse(request.responseText)

    if (data.length == 0) {
      loadMore.innerHTML = 'no more products to display...wait 5 sec'
      loadMore.setAttribute('disabled', 'true')

      setTimeout(() => {
        loadMore.removeAttribute('disabled')
        loadMore.innerHTML = 'Load More...'
      }, 5000)
    }

    for (i of data) {
      products.push(i)
      renderProduct(i)
    }
  })
})

getUserCart((cart) => {
  if (cart == null) {
    loadMore.click()
  } else {
    userCart = cart
    cartLength.innerHTML = cart.length
    loadMore.click()
  }
})

const renderProduct = (item) => {
  var itemDiv = document.createElement('div')
  itemDiv.classList.add('item-card')
  itemDiv.setAttribute('key', item._id)

  var image = document.createElement('img')
  image.setAttribute('src', item.image)
  image.classList.add('tile-img')

  var title = document.createElement('p')
  title.innerHTML = item.name

  var price = document.createElement('p')
  price.innerHTML = 'Price: Rs. ' + item.price

  var addToCart = document.createElement('button')
  addToCart.innerHTML = 'Add to Cart'
  addToCart.classList.add('view-details')

  var checkItemInCart = userCart.filter((i) => i.pId === item._id)
  if (checkItemInCart.length > 0) {
    addToCart.setAttribute('disabled', 'true')
    addToCart.innerHTML = 'Added!'
  }

  addToCart.addEventListener('click', () => {
    var request = new XMLHttpRequest()
    request.open('POST', '/shoppingCart/' + item._id)
    request.send()
    request.addEventListener('load', () => {
      console.log(request.responseText)
      if (request.status === 200) {
        addToCart.setAttribute('disabled', 'true')
        addToCart.innerHTML = 'Added!'
        cartLength.innerHTML = ~~cartLength.innerHTML + 1
      } else if (request.status === 401) {
        window.location.href = '/login'
      } else {
        console.log('some error occurred!')
      }
    })
  })

  var viewDets = document.createElement('button')
  viewDets.innerHTML = 'View Details'
  viewDets.classList.add('view-details')
  viewDets.addEventListener('click', () => {
    var popup = document.getElementsByClassName('popup')[0]
    popup.classList.remove('hidden')
    popup.style['height'] = screen.height + 30
    document.body.classList.add('no-scroll')

    var image = document.createElement('img')
    image.setAttribute('src', item.image)
    image.classList.add('popup-img')

    var title = document.createElement('h3')
    title.innerHTML = item.name

    var price = document.createElement('p')
    price.innerHTML = 'Price: Rs. ' + item.price

    var quantity = document.createElement('p')
    quantity.innerHTML = 'Available Quantity: ' + item.quantity

    var desc = document.createElement('p')
    desc.innerHTML = item.description

    popup.children[0].appendChild(image)
    popup.children[0].appendChild(title)
    popup.children[0].appendChild(price)
    popup.children[0].appendChild(quantity)
    popup.children[0].appendChild(desc)
  })

  itemDiv.appendChild(image)
  itemDiv.appendChild(title)
  itemDiv.appendChild(price)
  itemDiv.appendChild(addToCart)
  itemDiv.appendChild(viewDets)

  document.getElementsByClassName('cont')[0].appendChild(itemDiv)
}

var popupBtn = document.getElementById('popup-btn')
popupBtn.addEventListener('click', () => {
  var popup = document.getElementsByClassName('popup')[0]
  popup.classList.add('hidden')
  document.body.classList.remove('no-scroll')
  while (popup.children[0].children.length > 1) {
    popup.children[0].removeChild(popup.children[0].lastChild)
  }
})
