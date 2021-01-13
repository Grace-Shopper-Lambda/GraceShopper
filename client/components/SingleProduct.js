import React from 'react'
// import axios from 'axios'
import {connect} from 'react-redux'
import {fetchProduct} from '../store/singleproduct.js'

export class SingleProduct extends React.Component {
  constructor() {
    super()
    this.state = {
      dataLoaded: false
    }
  }

  addProductToCart = async () => {
    //this will put 1 of the item into our shopping cart
  }

  /* small note, but you don't need to use async/await in your component
  mount if you are using redux! the thunks handle that for us */
  componentDidMount = async () => {
    if (this.props.match) {
      await this.fetchProduct(this.props.match.params.id)
      await this.setState({dataLoaded: true, product: this.props.product})
    }
  }

  render() {
    if (this.state.dataLoaded === true) {
      const product = this.state.product
      return (
        <div>
          <div>{product.name}</div>
          <div>{product.imageUrl}</div>
          <div>Price: {product.price}</div>
          <div>Description: {product.description}</div>
          <button type="button" onClick={this.addProductToCart}>
            Add to cart
          </button>
        </div>
      )
    } else {
      return <div>LOADING</div>
    }
  }
}

const mapState = state => {
  return {
    product: state.product
  }
}

const mapDispatch = dispatch => {
  return {
    fetchProduct: id => dispatch(fetchProduct(id))
  }
}

export default connect(mapState, mapDispatch)(SingleProduct)
