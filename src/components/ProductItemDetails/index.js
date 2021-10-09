// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {quantity: 1, itemDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getItemDetails()
  }

  increaseQuantity = () => {
    const {quantity} = this.state
    this.setState({quantity: quantity + 1})
  }

  decreaseQuantity = () => {
    const {quantity} = this.state

    if (quantity === 1) {
      return this.setState({quantity})
    }
    return this.setState({quantity: quantity - 1})
  }

  onContinueShopping = () => {
    const {history} = this.props
    history.push('/products')
  }

  getItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
        similarProducts: fetchedData.similar_products.map(
          eachSimilarProduct => ({
            availability: eachSimilarProduct.availability,
            brand: eachSimilarProduct.brand,
            description: eachSimilarProduct.description,
            id: eachSimilarProduct.id,
            imageUrl: eachSimilarProduct.image_url,
            price: eachSimilarProduct.price,
            rating: eachSimilarProduct.rating,
            style: eachSimilarProduct.style,
            title: eachSimilarProduct.title,
            totalReviews: eachSimilarProduct.total_reviews,
          }),
        ),
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        itemDetails: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProductDetailsView = () => {
    const {quantity, itemDetails} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
      similarProducts,
    } = itemDetails
    return (
      <div className="productDetails-bg-container">
        <div className="item-container">
          <div className="item-image-container">
            <img src={imageUrl} alt="product" className="item-image" />
          </div>
          <div className="item-details-container">
            <h1 className="item-title">{title}</h1>
            <p className="item-price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="item-description">{description}</p>
            <span className="item-info">
              Available: <p className="item-info-details">{availability}</p>
            </span>
            <span className="item-info">
              Brand: <p className="item-info-details">{brand}</p>
            </span>
            <hr className="separator" />
            <div className="item-quantity-container">
              <button
                type="button"
                className="quantity-control-btn"
                onClick={this.decreaseQuantity}
                testid="minus"
              >
                <BsDashSquare className="item-quantity" />
              </button>
              <p className="item-quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-control-btn"
                onClick={this.increaseQuantity}
                testid="plus"
              >
                <BsPlusSquare className="item-quantity" />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              Add to cart
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <div className="similar-items-container">
            {similarProducts.map(eachSimilarProduct => (
              <SimilarProductItem
                key={eachSimilarProduct.id}
                similarItemDetails={eachSimilarProduct}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div testid="loader" className="loading-view-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="view-container">
      <div className="failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
          className="failure-view-image"
        />
        <h1>Product Not Found</h1>
        <button
          type="button"
          className="shopping-btn"
          onClick={this.onContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )

  renderAppropriateView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAppropriateView()}
      </>
    )
  }
}
export default ProductItemDetails
