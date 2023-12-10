const CartsEsquema = require('./models/carrito.model');
const ProductEsquema = require('./models/products.model');

class CarritoManager {
    
    async createEmptyCart() {
        try {
            const newCart = new CartsEsquema({});
            
            const existingCart = await CartsEsquema.findById(newCart._id);
            if (existingCart) {
                console.log('Ya existe un carrito con este ID:', newCart._id);
                return existingCart;
            }

            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear un carrito vacío:", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            return await CartsEsquema.findById(cartId).exec();
        } catch (error) {
            console.error("Error al obtener el carrito por ID:", error);
            throw error;
        }
    }
    
    async addProductToCart(cartId, productId, quantity) {
        try {
          const cart = await CartsEsquema.findById(cartId);
    
          if (!cart) {
            throw new Error('Carrito no encontrado.');
          }
    
          const product = await ProductEsquema.findById(productId);
    
          if (!product) {
            throw new Error('Producto no encontrado.');
          }
    
          // Verificar si el producto ya está en el carrito
          const existingItem = cart.items.find(item => item.product.equals(productId));
    
          if (existingItem) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            existingItem.quantity += quantity;
          } else {
            // Si el producto no está en el carrito, agregar un nuevo elemento
            cart.items.push({
              product: productId,
              quantity: quantity,
            });
          }
    
          // Utilizar funciones específicas de MongoDB para guardar el carrito actualizado
          const filter = { _id: cart._id };
          const update = { items: cart.items };
          await CartsEsquema.findByIdAndUpdate(filter, update);
    
          // Obtener el carrito actualizado después de la actualización
          const updatedCart = await CartsEsquema.findById(cartId);
    
          return updatedCart;
        } catch (error) {
          console.error('Error al agregar producto al carrito:', error);
          throw error;
        }
      }
}

    


module.exports = CarritoManager;