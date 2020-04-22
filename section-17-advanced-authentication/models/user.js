const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
      items: [ 
            {
              productId: { 
                  type: Schema.Types.ObjectId,
                  ref: 'Product',
                  required: true 
                }, 
              quantity: { 
                  type: Number, 
                  required: true 
                } 
            } 
        ]
  }
});

userSchema.methods.addToCart = function (product) {
    let quantity = 1;
    let updatedCartItems = [];
    let cartProductIndex;
    if (this.cart && this.cart.items) {
        cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        updatedCartItems = [ ...this.cart.items];
    }
    if (cartProductIndex >= 0) {
        quantity += this.cart.items[cartProductIndex].quantity;
        updatedCartItems[cartProductIndex].quantity = quantity;
    } else {
        updatedCartItems.push({ productId: product._id, quantity: quantity })
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedItemsCart = this.cart.items.filter(product => {
        return product.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedItemsCart;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);