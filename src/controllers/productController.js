const Product = require('../models/Product');

// Get all products with pagination and search
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || '';
        let category = req.query.category || '';

        // Build query
        const query = {};
        
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        if (category && category !== 'All' && category !== 'all') {
            query.category = { $regex: new RegExp('^' + category + '$', 'i') };
        }

        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);
        const categories = await Product.distinct('category');

        // ✅ Don't set any flash messages here - just render the page
        res.render('pages/index', {
            title: 'Products',
            products,
            categories: categories || [],
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            search: search || '',
            selectedCategory: category || ''
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        // ✅ Only flash error if there's actually an error
        req.flash('error_msg', 'Error fetching products');
        res.redirect('/');
    }
};

// Get single product detail
exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error_msg', 'Product not found');
            return res.redirect('/products');
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);

        res.render('pages/product-detail', {
            title: product.name,
            product,
            relatedProducts
        });
    } catch (error) {
        console.error('Error fetching product detail:', error);
        req.flash('error_msg', 'Error fetching product');
        res.redirect('/products');
    }
};

// Add new product (admin)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const product = new Product({
            name,
            description,
            price,
            category: category.toLowerCase(),
            stock: stock || 10
        });

        await product.save();
        req.flash('success_msg', 'Product created successfully');
        res.redirect('/products');
    } catch (error) {
        console.error('Error creating product:', error);
        req.flash('error_msg', 'Error creating product');
        res.redirect('/products');
    }
};