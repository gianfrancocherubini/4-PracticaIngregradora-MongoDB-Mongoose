const { Router } = require('express');
const ProductsManager = require('../dao/productsManagerFs');
const CarritoManager = require('../dao/carritoManagerFs');
const cm = new CarritoManager();
const pm = new ProductsManager();



const router = Router();



router.post('/', async (req, res) => {
    try {
        const { id } = req.body;
        if (!Number.isInteger(id)) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: 'El ID del carrito debe ser un número' });
            return;
        }

        const carts = await cm.getCart();
        const existingCart = carts.find(cart => cart.id === id);

        if (existingCart) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: 'El carrito con el mismo ID ya existe' });
            return;
        }

        const newCart = {
            id,
            products: []
        };

        carts.push(newCart);
        await saveCart(carts);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito: ", error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        if (isNaN(cartId)) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: 'El ID del carrito debe ser un número' });
            return;
        }

        const carts = await cm.getCart();
        const cart = carts.find(cart => cart.id === Number(cartId));

        if (cart) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(cart.products);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener productos del carrito: ", error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al obtener productos del carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid, 10);
        const productId = parseInt(req.params.pid, 10);
        const quantity = parseInt(req.body.quantity, 10) || 1;

        if (isNaN(cartId) || isNaN(productId) || isNaN(quantity) || quantity <= 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: 'Los IDs del carrito y del producto deben ser números, y la cantidad debe ser un número positivo' });
            return;
        }

        const carts = await cm.getCart();
        const cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }

        const products = await pm.getProducts();
        const product = products.find(product => product.id === productId);

        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }

        const existingProductInCart = cart.products.find(item => item.product.id === productId);
        if (existingProductInCart) {
            existingProductInCart.quantity += quantity;
        } else {
            cart.products.push({ product, quantity });
        }

        await cm.saveCart(carts);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ product, quantity });
    } catch (error) {
        console.error("Error al agregar un producto al carrito: ", error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al agregar un producto al carrito' });
    }
});

module.exports = router;