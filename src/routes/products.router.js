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
// router.put('/:pid', async (req, res) => {
//     try {
//         const productId = req.params.pid;
//         const {
//             title,
//             description,
//             price, 
//             thumbnails,
//             code,
//             stock,
//             status,
//             category
//         } = req.body;

//         if (!productId || isNaN(productId)) {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El ID de producto no es un número válido' });
//             return;
//         }

//         const productos = await pm.getProducts();
//         const productIndex = productos.findIndex(product => product.id === parseInt(productId, 10));

//         if (productIndex === -1) {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(404).json({ error: 'Producto no encontrado' });
//             return;
//         }

//         let propiedadesPermitidas=["title","description","price","thumbnails","code","stock","status","category"];
//         let propiedadesQueLlegan=Object.keys(req.body);
//         let valido=propiedadesQueLlegan.every(propiedad=>propiedadesPermitidas.includes(propiedad))
//         if(!valido){
//             res.setHeader('Content-Type', 'application/json')
//             return res.status(400).json({error:`No se aceptan algunas propiedades`, propiedadesPermitidas })

//         }

//         // Validación de campos
//         if (title && typeof title !== 'string') {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El campo title debe ser una cadena de texto' });
//             return;
//         }

//         if (description && typeof description !== 'string') {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El campo description debe ser una cadena de texto' });
//             return;
//         }

//         if (code && typeof code !== 'string') {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El campo code debe ser una cadena de texto' });
//             return;
//         }

//         if (category && typeof category !== 'string') {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El campo category debe ser una cadena de texto' });
//             return;
//         }

//         if (price && typeof price !== 'number') {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El campo price debe ser un número' });
//             return;
//         }

//         if (stock && typeof stock !== 'number') {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El campo stock debe ser un número' });
//             return;
//         }

//         if (status && typeof status !== 'boolean') {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El campo stock debe ser un valor booleano' });
//             return;
//         }

//         if (thumbnails) {
//             if (!Array.isArray(thumbnails) || !thumbnails.every(url => typeof url === 'string')) {
//                 res.setHeader('Content-Type', 'application/json');
//                 res.status(400).json({ error: 'El campo thumbnails debe ser un array de cadenas de texto que contienen las rutas de las imágenes' });
//                 return;
//             }
//         }

//         // Actualización de campos
//         if (title) {
//             productos[productIndex].title = title;
//         }

//         if (description) {
//             productos[productIndex].description = description;
//         }

//         if (price) {
//             productos[productIndex].price = price;
//         }

//         if (thumbnails) {
//             productos[productIndex].thumbnails = thumbnails;
//         }

//         if (code) {
//             productos[productIndex].code = code;
//         }

//         if (stock) {
//             productos[productIndex].stock = stock;
//         }

//         if (status) {
//             productos[productIndex].status = status;
//         }

//         if (category) {
//             productos[productIndex].category = category;
//         }

//         await pm.saveProducts(productos);
//         console.log("Producto actualizado correctamente.");
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json({ product: productos[productIndex] });
//     } catch (error) {
//         console.error("Error al actualizar el producto: ", error);
//         res.setHeader('Content-Type', 'application/json');
//         res.status(500).json({ error: 'Error al actualizar el producto' });
//     }
// });

// router.delete('/:pid', async (req, res) => {
//     try {
//         const productId = req.params.pid;

//         if (isNaN(productId)) {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(400).json({ error: 'El ID de producto no es un número válido' });
//             return;
//         }

//         const productos = await pm.getProducts();
//         const productIndex = productos.findIndex(product => product.id === parseInt(productId, 10));

//         if (productIndex === -1) {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(404).json({ error: 'Producto no encontrado' });
//             return;
//         }

//         productos.splice(productIndex, 1);

//         await pm.saveProducts(productos);
//         console.log("Producto eliminado correctamente.");
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json({ message: 'Producto eliminado correctamente' });
//     } catch (error) {
//         console.error("Error al eliminar el producto: ", error);
//         res.setHeader('Content-Type', 'application/json');
//         res.status(500).json({ error: 'Error al eliminar el producto' });
//     }
// });

module.exports = {router} ;