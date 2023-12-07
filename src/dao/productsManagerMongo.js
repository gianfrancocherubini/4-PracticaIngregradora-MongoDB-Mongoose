const ProductEsquema = require('./models/products.model');

class ProductsManager {
    
    async getProducts() {
        try {
            const products = await ProductEsquema.find().exec();
            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error;
        }
    }

    async saveProducts(products) {
        try {
            await ProductEsquema.insertMany(products);
        } catch (error) {
            console.error("Error al guardar productos:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductEsquema.findById(id).exec();

            if (product) {
                console.log("El producto encontrado es:", product);
                return product;
            } else {
                console.log("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            throw error;
        }
    }
}

module.exports = ProductsManager;