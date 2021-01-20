import axios from 'axios'

const SET_USER_CART = 'SET_USER_CART'
const ADD_PRODUCT_TO_USER_CART = 'ADD_PRODUCT_TO_USER_CART'
const ADD_TO_USER_CART = 'ADD_TO_USER_CART'
const SUBTRACT_FROM_USER_CART = 'SUBTRACT_FROM_USER_CART'
const DELETE_FROM_USER_CART = 'DELETE_FROM_USER_CART'
const USER_CHECKOUT = 'USER_CHECKOUT'

export const setUserCart = products => ({
  type: SET_USER_CART,
  products
})
export const addProductToUserCart = userCart => ({
  type: ADD_PRODUCT_TO_USER_CART,
  userCart
})
export const addToUserCart = productId => ({
  type: ADD_TO_USER_CART,
  productId
})
export const subtractFromUserCart = productId => ({
  type: SUBTRACT_FROM_USER_CART,
  productId
})
export const deleteFromUserCart = productId => ({
  type: DELETE_FROM_USER_CART,
  productId
})
export const userCheckout = () => ({
  type: USER_CHECKOUT
})

export const getUserShoppingCart = userId => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/users/${userId}/cart`)
      dispatch(setUserCart(data))
    } catch (err) {
      console.log(err)
    }
  }
}
export const addingToUserShoppingCart = (ProductId, UserId) => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`/api/users/${UserId}/cart`, {
        ProductId: ProductId
      })
      dispatch(addProductToUserCart(data))
    } catch (err) {
      console.log(err)
    }
  }
}
export const addingToUserCart = (ProductId, OrderId, userId) => {
  return async dispatch => {
    try {
      await axios.put(`/api/users/${userId}/cart/add`, {ProductId, OrderId})
      dispatch(addToUserCart(ProductId))
    } catch (err) {
      console.log(err)
    }
  }
}
export const subtractingFromUserCart = (ProductId, OrderId, userId) => {
  return async dispatch => {
    try {
      await axios.put(`/api/users/${userId}/cart/remove`, {ProductId, OrderId})
      dispatch(subtractFromUserCart(ProductId))
    } catch (err) {
      console.log(err)
    }
  }
}
export const deletingFromUserCart = (ProductId, userId) => {
  return async dispatch => {
    try {
      await axios.delete(`/api/users/${userId}/cart/${ProductId}`)
      dispatch(deleteFromUserCart(ProductId))
    } catch (err) {
      console.log(err)
    }
  }
}
export const userCartCheckout = userId => {
  return async dispatch => {
    try {
      const {data} = await axios.put(`/api/users/${userId}/checkout`)
      dispatch(userCheckout(data))
    } catch (err) {
      console.log(err)
    }
  }
}

const initialState = {
  userCart: []
}

// this reducer is a little unwieldy - one reason why refactoring initial state could help with legibility
// code is harder to maintain and debug when the reducer is lengthy
export default function userShoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_CART:
      return {...state, userCart: [...action.products]}
    case ADD_PRODUCT_TO_USER_CART:
      return {...state, userCart: [...state.userCart, action.userCart]}
    case ADD_TO_USER_CART: {
      const addedProducts = state.userCart.map(function add(product) {
        if (product.id === action.productId) {
          product.Orders[0].OrderHistory.quantity++
          return product
        } else {
          return product
        }
      })
      return {...state, userCart: addedProducts}
    }
    case SUBTRACT_FROM_USER_CART: {
      const subtractedProduct = state.userCart.map(function subtract(product) {
        if (
          product.id === action.productId &&
          product.Orders[0].OrderHistory.quantity > 1
        ) {
          product.Orders[0].OrderHistory.quantity--
          return product
        } else {
          return product
        }
      })
      return {...state, userCart: subtractedProduct}
    }
    case DELETE_FROM_USER_CART: {
      const deletedCart = state.userCart.filter(
        product => product.id !== action.productId
      )
      return {...state, userCart: deletedCart}
    }
    case USER_CHECKOUT:
      return initialState
    default:
      return state
  }
}
