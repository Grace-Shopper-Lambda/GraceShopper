import React from 'react'
import {connect} from 'react-redux'
import {
  fetchProducts,
  filterByValue,
  sortByAlphabet,
  sortByPrice
} from '../store/allProducts'
import {Link} from 'react-router-dom'

export class AllProducts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }
    this.handleKey = this.handleKey.bind(this)
    this.filterProducts = this.filterProducts.bind(this)
    this.sortProducts = this.sortProducts.bind(this)
    this.sortAsc = this.sortAsc.bind(this)
    this.sortDesc = this.sortDesc.bind(this)
  }
  componentDidMount() {
    this.props.fetchProducts()
  }

  handleKey(evt) {
    if (evt.key === 'Enter') {
      this.props.filterProducts(this.state.input)
      this.setState({input: ''})
    }
  }

  filterProducts = input => {
    input = input.toLowerCase()
    let filteredValues = this.props.products.filter(product => {
      return (
        product.name.toLowerCase().includes(input) ||
        product.brand.toLowerCase().includes(input)
      )
    })
    this.props.filter(filteredValues)
  }

  sortProducts(e) {
    let value = e.target.value
    let direction = value.endsWith('asc') ? 'asc' : 'desc'

    if (value.startsWith('price')) {
      let sortedPriceProducts =
        direction === 'asc'
          ? this.props.products.slice(0).sort((a, b) => a.price - b.price)
          : this.props.products.slice(0).sort((a, b) => b.price - a.price)
      this.props.priceSort(sortedPriceProducts)
    } else {
      let sortedPriceProducts =
        direction === 'asc'
          ? this.sortAsc(this.props.products, 'name')
          : this.sortDesc(this.props.products, 'name')
      this.props.alphaSort(sortedPriceProducts)
    }
  }

  sortAsc = (arr, field) => {
    return arr.slice(0).sort(function(a, b) {
      if (a[field] > b[field]) return 1

      if (b[field] > a[field]) return -1

      return 0
    })
  }

  sortDesc = (arr, field) => {
    return arr.slice(0).sort(function(a, b) {
      if (a[field] > b[field]) return -1

      if (b[field] > a[field]) return 1

      return 0
    })
  }

  render() {
    const {products} = this.props
    return (
      <header className="flex-container">
        <span>
          {' '}
          <h1 id="shopcart">All Hats</h1>
          <div>
            <span id="thefilterer">
              {' '}
              <input
                id="filter"
                type="text"
                value={this.state.input}
                onChange={evt => {
                  this.setState({input: evt.target.value})
                }}
                onKeyDown={this.handleKey}
                style={{width: '100%'}}
                placeholder="Filter by"
              />
              <button
                type="button"
                onClick={() => {
                  this.filterProducts(this.state.input)
                  this.setState({input: ''})
                }}
              >
                Filter
              </button>
              <select
                id="filter"
                onChange={e => {
                  this.sortProducts(e)
                }}
              >
                <option id="filter" value="" disabled selected>
                  Sort by
                </option>

                <option id="filter" value="alphabet_asc">
                  Name - A-Z
                </option>
                <option id="filter" value="alphabet_desc">
                  Name - Z-A
                </option>

                <option id="filter" value="price_asc">
                  Price - Lowest to Highest
                </option>
                <option id="filter" value="price_desc">
                  Price - Highest to Lowest
                </option>
              </select>
              <button
                type="button"
                onClick={() => {
                  this.props.fetchProducts()
                  this.setState({input: ''})
                }}
              >
                RESET
              </button>
            </span>
            {products.map(product => (
              <div key={product.id}>
                <Link to={`/product/${product.id}`}>
                  <h4 id="allproducttext">{product.name}</h4>
                  <h4 id="allproducttext">{(product.price * 1).toFixed(2)}</h4>
                  <img src={product.imageUrl} height="250" />
                </Link>
              </div>
            ))}
          </div>
        </span>
      </header>
    )
  }
}
const mapState = state => {
  return {products: state.allProductsReducer.all}
}

const mapDispatch = dispatch => {
  return {
    fetchProducts: () => {
      dispatch(fetchProducts())
    },
    filter: value => {
      dispatch(filterByValue(value))
    },
    priceSort: value => {
      dispatch(sortByPrice(value))
    },
    alphaSort: value => {
      dispatch(sortByAlphabet(value))
    }
  }
}

export default connect(mapState, mapDispatch)(AllProducts)
