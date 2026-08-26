const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },

        paymentMethod: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'cod'],
            default: 'cod'
        },

        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },

        orderStatus: {
            type: String,
            enum: [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ],
            default: 'pending'
        },

        orderDate: {
            type: Date,
            default: Date.now
        },

        deliveredAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;