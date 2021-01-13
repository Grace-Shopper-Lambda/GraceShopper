import axios from 'axios'

const SET_PRODUCTS = 'SET_PRODUCTS'
const ADD_PRODUCTS = 'ADD_PRODUCTS'
const DELETE_PRODUCTS = 'DELETE_PRODUCTS'

export const setProducts = products => ({
  type: SET_PRODUCTS,
  products
})

export const fetchProducts = () => {
  return async dispatch => {
    try {
      const {data: products} = await axios.get('/api/products')
      dispatch(setProducts(products))
    } catch (error) {
      console.error(error)
    }
  }
}

// consistent naming conventions
// ok to use _ but you should pick either how you did it for _addProduct or how you did it for setProducts and stick with it
export const _addProduct = product => ({
  type: ADD_PRODUCTS,
  product
})

export const addProduct = product => {
  return async dispatch => {
    const created = await axios.post('/api/products', product)
    dispatch(_addProduct(created.data))
  }
}

export const _deleteProduct = product => ({
  type: DELETE_PRODUCTS,
  product
})

export const deleteProduct = product => {
  return async dispatch => {
    await axios.delete(`/api/products/${product.id}`)
    dispatch(_deleteProduct(product))
  }
}

// consider making this an empty array rather than an object - then your reducer will be cleaner and you can just map the products in the front end instead of having to do products.all (unless there was another reason you wanted to use an object?)
const initialState = {
  all: []
}

// Take a look at app/redux/index.js to see where this reducer is
// added to the Redux store with combineReducers
export default function ProductsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return {...state, all: action.products}
    case ADD_PRODUCTS:
      return {...state, all: [...state.all, action.product]}
    case DELETE_PRODUCTS:
      return {
        ...state,
        all: state.all.filter(product => product.id !== action.product.id)
      }
    default:
      return state
  }
}
