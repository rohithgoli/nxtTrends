import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeAllCartItems = () => this.setState({cartList: []})

  removeCartItem = productId => {
    const {cartList} = this.state
    const updatedCartList = cartList.filter(
      eachItem => eachItem.id !== productId,
    )
    return this.setState({cartList: updatedCartList})
  }

  decrementCartItemQuantity = productId => {
    const {cartList} = this.state
    const itemIndex = cartList.findIndex(eachItem => eachItem.id === productId)

    const desiredItem = cartList[itemIndex]
    const currentQuantity = desiredItem.quantity
    if (currentQuantity === parseInt(1)) {
      cartList.splice(itemIndex, 1)
    } else {
      const updatedItem = {...desiredItem, quantity: desiredItem.quantity - 1}
      cartList.splice(itemIndex, 1, updatedItem)
    }
    return this.setState({cartList})
  }

  incrementCartItemQuantity = productId => {
    const {cartList} = this.state

    const updatedCartList = cartList.map(eachItem => {
      if (eachItem.id === productId) {
        const updatedItem = {...eachItem, quantity: eachItem.quantity + 1}
        return updatedItem
      }
      return eachItem
    })
    return this.setState({cartList: updatedCartList})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const currentCartItem = cartList.find(
      eachItem => eachItem.id === product.id,
    )
    if (currentCartItem === undefined) {
      return this.setState(prevState => ({
        cartList: [...prevState.cartList, product],
      }))
    }
    const itemId = currentCartItem.id
    const currentQuantity = currentCartItem.quantity
    const addedQuantity = product.quantity

    return this.setState({
      cartList: cartList.map(eachItem => {
        if (eachItem.id === itemId) {
          const updatedQuantity = currentQuantity + addedQuantity
          return {...eachItem, quantity: updatedQuantity}
        }
        return eachItem
      }),
    })
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
