const express = require('express');
const routerCarrito = require('./routes/carrito.router');
const { router } = require('./routes/products.router');
const mongoose =require(`mongoose`)

const PORT = 3111;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', router)
app.use('/api/carts', routerCarrito)

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
});



const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://cherussa:chilindrina123@gianfrancocluster.km1jj9i.mongodb.net/?retryWrites=true&w=majority', { dbName: 'ecommerce' });
        console.log('DB online..!');
    } catch (error) {
        console.log(error.message);
    }
};

connectToDatabase();