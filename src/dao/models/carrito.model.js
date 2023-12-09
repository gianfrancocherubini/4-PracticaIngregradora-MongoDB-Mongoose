const mongoose = require('mongoose');
const Product = require('./products.model');

const cartsColeccion = 'carts';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: Product.schema,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
}, {
  timestamps: true, 
  strict: false,    
});

const Cart = mongoose.model(cartsColeccion, cartSchema);

module.exports = Cart;