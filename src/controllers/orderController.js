const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get checkout page
exports.getCheckout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user.id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            req.flash('error_msg', 'Your cart is empty');
            return res.redirect('/cart');
        }

        res.render('pages/checkout', {
            title: 'Checkout',
            cart,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error loading checkout');
        res.redirect('/cart');
    }
};

// Place order
exports.placeOrder = async (req, res) => {
    try {
        const { address, city, state, zipCode, country, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.session.user.id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            req.flash('error_msg', 'Your cart is empty');
            return res.redirect('/cart');
        }

        // Check stock for all items
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product.stock < item.quantity) {
                req.flash('error_msg', `Not enough stock for ${product.name}`);
                return res.redirect('/cart');
            }
        }

        // Create order
        const order = new Order({
            user: req.session.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cart.totalPrice,
            shippingAddress: {
                street: address,
                city,
                state,
                zipCode,
                country
            },
            paymentMethod: paymentMethod || 'cod'
        });

        await order.save();

        // Update product stock
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            await product.save();
        }

        // Clear cart
        await Cart.findOneAndDelete({ user: req.session.user.id });

        req.flash('success_msg', 'Order placed successfully!');
        res.redirect(`/orders/${order._id}`);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error placing order');
        res.redirect('/checkout');
    }
};

// Get order detail
exports.getOrderDetail = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (!order) {
            req.flash('error_msg', 'Order not found');
            return res.redirect('/orders');
        }

        // Check if order belongs to user or user is admin
        if (order.user._id.toString() !== req.session.user.id && 
            req.session.user.role !== 'admin') {
            req.flash('error_msg', 'Unauthorized access');
            return res.redirect('/');
        }

        res.render('pages/order-detail', {
            title: `Order #${order._id}`,
            order
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error fetching order');
        res.redirect('/orders');
    }
};

// Get user orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.user.id })
            .sort({ orderDate: -1 });

        res.render('pages/orders', {
            title: 'My Orders',
            orders
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error fetching orders');
        res.redirect('/');
    }
};

// Cancel order (only if pending)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            req.flash('error_msg', 'Order not found');
            return res.redirect('/orders');
        }

        if (order.orderStatus !== 'pending') {
            req.flash('error_msg', 'Only pending orders can be cancelled');
            return res.redirect(`/orders/${order._id}`);
        }

        order.orderStatus = 'cancelled';
        await order.save();

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        req.flash('success_msg', 'Order cancelled successfully');
        res.redirect('/orders');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error cancelling order');
        res.redirect('/orders');
    }
};