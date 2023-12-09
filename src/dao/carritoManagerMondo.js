const CartsEsquema = require('./models/carrito.model');

class CarritoManager {
    
    async getCart() {
        try {
            const productosCarrito = await CartsEsquema.find().exec();
            return productosCarrito;
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw error;
        }
    }

    async saveCart(cart) {
        try {
            await CartsEsquema.create(cart);
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
            throw error;
        }
    }
    
}

module.exports = CarritoManager;