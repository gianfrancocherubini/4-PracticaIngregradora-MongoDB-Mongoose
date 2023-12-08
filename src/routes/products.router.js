const {Router}=require('express')
const ProductsManager = require('../dao/productsManagerMongo');
const ProductEsquema = require('../dao/models/products.model');

const productsManager =new ProductsManager()

const router=Router()
 
router.get('/', async (req, res) => {
    try {
        let limit = req.query.limit;
        let products = await productsManager.getProducts();

        if (!products || products.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ Products: [] });
            console.log("No hay productos en la base de datos.");
            return;
        }

        if (limit) {
            let limitedProducts = products.slice(0, parseInt(limit, 10));
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ Products: limitedProducts });
            console.log(limitedProducts);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ products });
            console.log(products);
        }
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        if (!productId) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: 'Se debe proporcionar un ID de producto válido.' });
            return;
        }

        const product = await productsManager.getProductById(productId);

        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ Product: product });
        console.log('Producto encontrado:', product);
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProductData = req.body;
        const requiredFields = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!newProductData[field]) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
                return;
            }
        }

        await productsManager.saveProducts([newProductData]);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ success: true, message: 'Producto agregado correctamente.' });
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al agregar el producto.' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProductData = req.body;

        const existingProduct = await productsManager.getProductById(productId);

        if (!existingProduct) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        }

        const fieldsToUpdate = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category','deleted'];
        const updateData = {};
        for (const field of fieldsToUpdate) {
            if (updatedProductData[field] !== undefined) {
                updateData[field] = updatedProductData[field];
            }
        }

        if (updatedProductData._id !== productId) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: "No se permite modificar el ID del producto." });
            return;
        }

        const productSchemaKeys = Object.keys(ProductEsquema.schema.paths);

        const invalidFields = Object.keys(updatedProductData).filter(field => {
            return !productSchemaKeys.includes(field) || typeof updatedProductData[field] !== ProductEsquema.schema.paths[field].instance;
        });
        if (invalidFields.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: `Campos no permitidos o de tipo incorrecto: ${invalidFields.join(', ')}` });
            return;
        }
        
        Object.assign(existingProduct, updateData);

        await productsManager.saveProducts([existingProduct]);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, message: 'Producto actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

module.exports = {router} ;