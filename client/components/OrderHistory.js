import React from 'react'
import {connect} from 'react-redux'
import dateFormat from 'dateformat'
import {getOrderHistory} from '../store/orderHistory'

class OrderHistory extends React.Component {
  componentDidMount() {
    this.props.fetchOrderHistory(this.props.match.params.id)
  }

  render() {
    const orderHistory = this.props.history

    return (
      <div>
        <h1>Order History</h1>
        <div>
          {orderHistory.length === 0 ? (
            <div>You Have Not Purchased Any Of Our Crazy Vito's Hats!</div>
          ) : (
            <div className="orderhistorymap">
              {orderHistory.map(order => {
                return (
                  <div id="borderboi" key={order.id}>
                    {' '}
                    ORDER PLACED: <br />{' '}
                    {dateFormat(order.updatedAt, 'fullDate')} <br />
                    TOTAL:{' '}
                    {order.Products.reduce(
                      (acc, product) =>
                        acc + product.price * product.orderQuantity,
                      0
                    ).toFixed(2)}
                    <br />
                    <br />
                    <div className="borderboi">
                      <div className="flex-cart">
                        {order.Products.map(product => {
                          return (
                            <div key={product.id}>
                              <>Name: {product.name}</>
                              <br />
                              <>Price: ${product.price}</>
                              <br />
                              <>Quantity: {product.OrderHistory.quantity}</>
                              <br />
                              <img src={product.imageUrl} height="180" />
                              <br />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    history: state.orderHistoryReducer.history
  }
}

const mapDispatch = dispatch => {
  return {
    fetchOrderHistory: id => {
      dispatch(getOrderHistory(id))
    }
  }
}

export default connect(mapState, mapDispatch)(OrderHistory)
