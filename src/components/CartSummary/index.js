// Write your code here
import CartContext from '../../context/CartContext'
import './index.css'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value
      const orderValueList = cartList.map(
        eachItem => eachItem.quantity * eachItem.price,
      )
      const orderValue = orderValueList.reduce(
        (prevValue, currentValue) => prevValue + currentValue,
      )

      return (
        <div className="cart-summary-container">
          <div className="summary-container">
            <h1 className="order-title">
              Order Total:{' '}
              <span className="order-value">Rs {orderValue}/-</span>
            </h1>
            <p className="order-count">{cartList.length} Items in Cart</p>
            <button type="button" className="checkout-btn">
              Checkout
            </button>
          </div>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
