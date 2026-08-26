const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
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

                image: {
                    type: String,
                    default: ''
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                },

                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        totalPrice: {
            type: Number,
            default: 0
        },

        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Calculate total before saving
CartSchema.pre('save', function () {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    this.updatedAt = new Date();
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;