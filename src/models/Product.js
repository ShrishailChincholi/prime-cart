const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: 'default-product.jpg'
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 10
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },

                rating: {
                    type: Number,
                    min: 1,
                    max: 5
                },

                comment: {
                    type: String,
                    default: ''
                },

                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;