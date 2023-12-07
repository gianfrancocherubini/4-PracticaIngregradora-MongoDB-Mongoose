const mongoose =require('mongoose')

const productsColeccion='products'
const productsEsquema= new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        thumbnails: {
            type: [String], // Array de strings (URLs de imágenes)
            required: true
        },
        code: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            default: true // Puedes establecer un valor predeterminado si es necesario
        },
        category: {
            type: String,
            required: true
        },
        deleted: {
            type: Boolean,
            default: false // Puedes establecer un valor predeterminado si es necesario
        }
    },
    {
        timestamps: true, // Agregado para habilitar timestamps (createdAt y updatedAt)
        strict: false // Agregado para permitir campos adicionales no definidos en el esquema
    }
)