import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
  getUserShoppingCart,
  addingToUserCart,
  subtractingFromUserCart,
  deletingFromUserCart,
  userCartCheckout
} from '../store/userShoppingCart'

// you can consider splitting some code out into smaller components
// for those that are getting a little longer in the render :)

class UserShoppingCart extends Component {
  componentDidMount() {
    this.props.loadUserShoppingCart(this.props.match.params.id)
  }

  // nice front-end validations on the decimals
  roundDecimal(num) {
    return Number(num).toFixed(2)
  }

  render() {
    const products = this.props.products
    const userId = this.props.match.params.id

    let total = products
      .reduce(function(acc, product) {
        return acc + product.price * product.Orders[0].OrderHistory.quantity
      }, 0)
      .toFixed(2)

    return (
      <div>
        <h1 id="shopcart">Shopping Cart</h1>
        <div id="thisguy" />
        {products.length === 0 ? (
          <div>Shopping Cart Is Empty</div>
        ) : (
          <div className="flex-cart" id="checkoutDiv">
            {products.map(product => (
              <div className="cartdiv" key={product.id}>
                <h4>{product.name}</h4>
                <img src={product.imageUrl} height="185" />
                <h4>Quantity: {product.Orders[0].OrderHistory.quantity}</h4>
                <h4>
                  Price: $
                  {this.roundDecimal(product.price * product.orderQuantity)}
                </h4>
                <button
                  className="cartAddSubtractButton"
                  type="button"
                  value="increment"
                  onClick={() =>
                    this.props.addToUserCart(
                      product.id,
                      product.Orders[0].id,
                      userId
                    )
                  }
                >
                  +
                </button>
                <button
                  className="cartAddSubtractButton"
                  type="button"
                  value="decrement"
                  onClick={() =>
                    this.props.subtractFromUserCart(
                      product.id,
                      product.Orders[0].id,
                      userId
                    )
                  }
                >
                  -
                </button>
                <div id="checkoutDiv">
                  <button
                    className="cartAddSubtractButton"
                    type="button"
                    onClick={() =>
                      this.props.deleteProductFromUserCart(product.id, userId)
                    }
                  >
                    Remove From Cart
                  </button>
                </div>
              </div>
            ))}
            <div id="thisguy">
              {products === null ? (
                <div>Shopping Cart Is Empty</div>
              ) : (
                <div id="checkoutDiv">
                  <div id="checkoutDiv">TOTAL: ${total}</div>
                  <Link to="/orderconfirmation">
                    <button
                      id="checkoutButton"
                      type="submit"
                      onClick={() => this.props.userCheckout(userId)}
                    >
                      Place Your Order
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    products: state.userShoppingCartReducer.userCart
  }
}

const mapDispatch = dispatch => {
  return {
    loadUserShoppingCart: userId => {
      dispatch(getUserShoppingCart(userId))
    },
    addToUserCart: (productId, orderId, userId) => {
      dispatch(addingToUserCart(productId, orderId, userId))
    },
    subtractFromUserCart: (productId, orderId, userId) => {
      dispatch(subtractingFromUserCart(productId, orderId, userId))
    },
    deleteProductFromUserCart: (productId, userId) => {
      dispatch(deletingFromUserCart(productId, userId))
    },
    userCheckout: userId => {
      dispatch(userCartCheckout(userId))
    }
  }
}

export default connect(mapState, mapDispatch)(UserShoppingCart)
