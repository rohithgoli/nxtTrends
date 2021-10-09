// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarItemDetails} = props
  const {imageUrl, title, brand, price, rating} = similarItemDetails

  return (
    <div className="similar-product-card">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <p className="product-title">{title}</p>
      <p className="product-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="product-price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem
