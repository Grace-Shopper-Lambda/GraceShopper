const SET_GUEST_SHOPPING_CART = 'SET_GUEST_SHOPPING_CART'
const ADD_PRODUCT_TO_CART = 'ADD_PRODUCT_TO_CART'
const ADD_TO_CART = 'ADD_TO_CART'
const SUBTRACT_FROM_CART = 'SUBTRACT_FROM_CART'
const DELETE_FROM_CART = 'DELETE_FROM_CART'
const GUEST_CHECKOUT = 'GUEST_CHECKOUT'

export const setGuestShoppingCart = products => ({
  type: SET_GUEST_SHOPPING_CART,
  products
})
export const addProductToCart = guestCart => ({
  type: ADD_PRODUCT_TO_CART,
  guestCart
})
export const addToCart = guestCart => ({
  type: ADD_TO_CART,
  guestCart
})
export const subtractFromCart = guestCart => ({
  type: SUBTRACT_FROM_CART,
  guestCart
})
export const deleteFromCart = guestCart => ({
  type: DELETE_FROM_CART,
  guestCart
})
export const guestCheckout = () => ({
  type: GUEST_CHECKOUT
})

export const getGuestShoppingCart = () => {
  return async dispatch => {
    try {
      // no need to await local storage
      const products = await JSON.parse(localStorage.getItem('shoppingCart'))
      dispatch(setGuestShoppingCart(products))
    } catch (err) {
      console.log(err)
    }
  }
}

// two versions of addToCart here currently - just in case?
export const addingToShoppingCart = product => {
  return dispatch => {
    try {
      let cart = JSON.parse(localStorage.getItem('shoppingCart'))
      if (cart) {
        const productArray = [...cart].map(item => item.id)
        // checking id to see if product is not in the cart
        if (!productArray.includes(product.id)) {
          cart.push(product)
        } else {
          // if product is in the cart...loop through to increase quantity
          // for (let i = 0; i < cart.length; i++) {
          //   if (product.id === cart[i].id) {
          //     cart[i].orderQuantity++
          //   }
          // }
        }
      } else {
        cart = []
        cart.push(product)
      }
      localStorage.setItem('shoppingCart', JSON.stringify(cart))
      dispatch(addProductToCart(cart))
      // localStorage.clear()
    } catch (err) {
      console.log(err)
    }
  }
}
export const addingToCart = productId => {
  return dispatch => {
    try {
      let cart = JSON.parse(localStorage.getItem('shoppingCart'))
      // I think forEach would be a better choice, so you can loop and just use
      // the id check as the filter + increment (then no returning is necessary)
      cart.filter(item => {
        //filter through cart to see and increase the quantity of the product
        if (productId === item.id) {
          return (item.orderQuantity += 1)
        }
      })
      localStorage.setItem('shoppingCart', JSON.stringify(cart))
      dispatch(addToCart(cart))
    } catch (err) {
      console.log(err)
    }
  }
}
export const subtractingFromCart = productId => {
  return dispatch => {
    try {
      let cart = JSON.parse(localStorage.getItem('shoppingCart'))
      cart.filter(item => {
        //filter through cart to see and decrease the quantity of the product
        if (productId === item.id && item.orderQuantity !== 1) {
          return (item.orderQuantity -= 1)
        }
      })
      localStorage.setItem('shoppingCart', JSON.stringify(cart))
      dispatch(subtractFromCart(cart))
    } catch (err) {
      console.log(err)
    }
  }
}

export const deletingFromCart = productId => {
  return dispatch => {
    try {
      let cart = JSON.parse(localStorage.getItem('shoppingCart'))
      // this is a better use of .filter()
      let newCart = cart.filter(item => {
        //filter through cart and return items that are not the product
        if (productId !== item.id) return item
      })
      localStorage.setItem('shoppingCart', JSON.stringify(newCart))
      dispatch(deleteFromCart(newCart))
    } catch (err) {
      console.log(err)
    }
  }
}
export const guestCartCheckout = () => {
  return dispatch => {
    try {
      let cart = []
      localStorage.setItem('shoppingCart', JSON.stringify(cart))
      dispatch(deleteFromCart(cart))
      // localStorage.clear()
    } catch (err) {
      console.log(err)
    }
  }
}

// you could just make this an array to make the reducer a little cleaner
// it's probably a lot/not a priority to redo all of your initial states at this point, but it makes for easier access
const initialState = {
  cart: []
}

export default function guestShoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GUEST_SHOPPING_CART:
      return {...state, cart: action.products}
    case ADD_PRODUCT_TO_CART:
      return {...state, cart: action.guestCart}
    case ADD_TO_CART:
      return {...state, cart: action.guestCart}
    case SUBTRACT_FROM_CART:
      return {...state, cart: action.guestCart}
    case DELETE_FROM_CART:
      return {...state, cart: action.guestCart}
    case GUEST_CHECKOUT:
      return state
    default:
      return state
  }
}
