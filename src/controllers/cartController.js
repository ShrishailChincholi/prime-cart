const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ==============================
// Get Cart
// ==============================
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.session.user.id
        }).populate('items.product');

        if (!cart) {
            cart = {
                items: [],
                totalPrice: 0
            };
        }

        res.render('pages/cart', {
            title: 'Shopping Cart',
            cart
        });

    } catch (error) {
        console.error('Get cart error:', error);

        req.flash('error_msg', 'Error fetching cart');
        res.redirect('/');
    }
};


// ==============================
// Add To Cart
// ==============================
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            req.flash('error_msg', 'Product not found');
            return res.redirect('/products');
        }

        const requestedQuantity = parseInt(quantity);

        // Validate quantity
        if (isNaN(requestedQuantity) || requestedQuantity < 1) {
            req.flash('error_msg', 'Invalid quantity');
            return res.redirect(`/products/${productId}`);
        }

        // Check stock
        if (product.stock < requestedQuantity) {
            req.flash('error_msg', 'Not enough stock available');
            return res.redirect(`/products/${productId}`);
        }

        let cart = await Cart.findOne({
            user: req.session.user.id
        });

        // Create cart if it does not exist
        if (!cart) {
            cart = new Cart({
                user: req.session.user.id,
                items: []
            });
        }

        // Check if product already exists
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            // Check total quantity against stock
            if (
                existingItem.quantity + requestedQuantity >
                product.stock
            ) {
                req.flash(
                    'error_msg',
                    'Cannot add more items than available stock'
                );

                return res.redirect('/cart');
            }

            existingItem.quantity += requestedQuantity;
            existingItem.price = product.price;

            // Update name and image also
            existingItem.name = product.name;
            existingItem.image = product.image;

        } else {
            // Add complete product information
            cart.items.push({
                product: product._id,
                name: product.name,
                image: product.image,
                quantity: requestedQuantity,
                price: product.price
            });
        }

        await cart.save();

        req.flash('success_msg', 'Product added to cart');

        res.redirect('/cart');

    } catch (error) {
        console.error('Add to cart error:', error);

        req.flash('error_msg', 'Error adding to cart');
        res.redirect('/products');
    }
};


// ==============================
// Update Cart Item
// ==============================
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;

        const requestedQuantity = parseInt(quantity);

        if (isNaN(requestedQuantity)) {
            req.flash('error_msg', 'Invalid quantity');
            return res.redirect('/cart');
        }

        const cart = await Cart.findOne({
            user: req.session.user.id
        });

        if (!cart) {
            req.flash('error_msg', 'Cart not found');
            return res.redirect('/cart');
        }

        const item = cart.items.id(itemId);

        if (!item) {
            req.flash('error_msg', 'Item not found in cart');
            return res.redirect('/cart');
        }

        // Remove item if quantity is 0
        if (requestedQuantity <= 0) {
            item.deleteOne();

            await cart.save();

            req.flash('success_msg', 'Item removed from cart');
            return res.redirect('/cart');
        }

        // Check stock
        const product = await Product.findById(item.product);

        if (!product) {
            req.flash('error_msg', 'Product no longer exists');
            return res.redirect('/cart');
        }

        if (product.stock < requestedQuantity) {
            req.flash('error_msg', 'Not enough stock available');
            return res.redirect('/cart');
        }

        item.quantity = requestedQuantity;

        // Keep latest product details
        item.price = product.price;
        item.name = product.name;
        item.image = product.image;

        await cart.save();

        req.flash('success_msg', 'Cart updated');
        res.redirect('/cart');

    } catch (error) {
        console.error('Update cart error:', error);

        req.flash('error_msg', 'Error updating cart');
        res.redirect('/cart');
    }
};


// ==============================
// Remove From Cart
// ==============================
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.session.user.id
        });

        if (!cart) {
            req.flash('error_msg', 'Cart not found');
            return res.redirect('/cart');
        }

        const item = cart.items.id(req.params.itemId);

        if (!item) {
            req.flash('error_msg', 'Item not found');
            return res.redirect('/cart');
        }

        item.deleteOne();

        await cart.save();

        req.flash('success_msg', 'Item removed from cart');
        res.redirect('/cart');

    } catch (error) {
        console.error('Remove cart item error:', error);

        req.flash('error_msg', 'Error removing item');
        res.redirect('/cart');
    }
};


// ==============================
// Clear Cart
// ==============================
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({
            user: req.session.user.id
        });

        req.flash('success_msg', 'Cart cleared');
        res.redirect('/cart');

    } catch (error) {
        console.error('Clear cart error:', error);

        req.flash('error_msg', 'Error clearing cart');
        res.redirect('/cart');
    }
};