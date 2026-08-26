const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// =========================
// PRODUCT SCHEMA
// =========================
const productSchema = new mongoose.Schema(
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
            required: true
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
                rating: Number,
                comment: String,
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


// =========================
// USER SCHEMA
// =========================
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },

        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


// =========================
// PASSWORD HASHING
// =========================
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        return next();
    }

    try {

        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(
            this.password,
            salt
        );

        next();

    } catch (error) {

        next(error);

    }

});


// =========================
// MODELS
// =========================
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);


// =========================
// PRODUCTS
// =========================

const products = [

    {
        name: "Coffee Maker Deluxe",
        description: "Premium coffee maker with built-in grinder and programmable settings. Brew the perfect cup every time with this deluxe coffee maker.",
        price: 129.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        stock: 25,
        rating: 4.5
    },

    {
        name: "Smart Watch Series 5",
        description: "Advanced smartwatch with health tracking, GPS, heart rate monitor, and long battery life.",
        price: 249.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        stock: 15,
        rating: 4.6
    },

    {
        name: "Organic Skincare Set",
        description: "Complete organic skincare set including cleanser, toner, moisturizer, and serum.",
        price: 59.99,
        category: "beauty",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
        stock: 30,
        rating: 4.7
    },

    {
        name: "Wireless Earbuds Pro",
        description: "High-quality wireless earbuds with noise cancellation, waterproof design, and 8-hour battery life.",
        price: 89.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80",
        stock: 20,
        rating: 4.3
    },

    {
        name: "Yoga Mat Premium",
        description: "Eco-friendly non-slip yoga mat with alignment lines. Perfect for yoga, pilates, and floor exercises.",
        price: 39.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
        stock: 40,
        rating: 4.4
    },

    {
        name: "Desk Lamp LED",
        description: "Adjustable LED desk lamp with multiple brightness levels and color temperatures.",
        price: 34.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        stock: 35,
        rating: 4.2
    },

    {
        name: "Laptop Backpack Pro",
        description: "Water-resistant laptop backpack with padded compartment for 15-inch laptops.",
        price: 79.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        stock: 28,
        rating: 4.5
    },

    {
        name: "Fitness Tracker Band",
        description: "Waterproof fitness tracker with heart rate monitor, step counter, and sleep tracking.",
        price: 49.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80",
        stock: 45,
        rating: 4.1
    },

    {
        name: "Aromatherapy Diffuser",
        description: "Ultrasonic essential oil diffuser with LED mood lighting and auto-shutoff.",
        price: 29.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
        stock: 50,
        rating: 4.3
    },

    {
        name: "Wireless Keyboard",
        description: "Slim wireless keyboard with quiet keys and long battery life.",
        price: 45.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        stock: 22,
        rating: 4.0
    },

    {
        name: "Ceramic Plant Pot Set",
        description: "Set of 3 ceramic plant pots with drainage holes and saucers.",
        price: 24.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
        stock: 38,
        rating: 4.4
    },

    {
        name: "Bamboo Cutting Board",
        description: "Eco-friendly bamboo cutting board set with juice groove and non-slip edges.",
        price: 34.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=800&q=80",
        stock: 32,
        rating: 4.2
    },

    {
        name: "Resistance Bands Set",
        description: "Complete resistance bands set with 5 different resistance levels.",
        price: 19.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80",
        stock: 60,
        rating: 4.6
    },

    {
        name: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
        price: 69.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
        stock: 18,
        rating: 4.5
    }

];


// =========================
// SEED DATABASE
// =========================

const seedDatabase = async () => {

    try {

        console.log('\n📡 Connecting to MongoDB...');

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Connected to MongoDB\n');


        // =========================
        // CLEAR OLD DATA
        // =========================

        await Product.deleteMany({});
        await User.deleteMany({});

        console.log('🗑️ Cleared existing data\n');


        // =========================
        // INSERT PRODUCTS
        // =========================

        const insertedProducts =
            await Product.insertMany(products);

        console.log(
            `✅ Inserted ${insertedProducts.length} products\n`
        );


        // =========================
        // USERS
        // =========================

        const users = [

            {
                name: 'Test User',

                email: 'test@example.com',

                password: 'password123',

                role: 'user',

                address: {
                    street: '123 Main Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                }
            },

            {
                name: 'Admin User',

                email: 'admin@example.com',

                password: 'admin123',

                role: 'admin',

                address: {
                    street: '456 Admin Avenue',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94105',
                    country: 'USA'
                }
            }

        ];


        // IMPORTANT:
        // This is INSIDE async seedDatabase()
        await User.insertMany(users);


        console.log('✅ Created test users');

        console.log(
            '   📧 test@example.com  🔑 password123'
        );

        console.log(
            '   📧 admin@example.com  🔑 admin123\n'
        );


        // =========================
        // PRODUCT LOG
        // =========================

        console.log('📦 Products Added:');

        insertedProducts.forEach((product, index) => {

            console.log(
                `   ${index + 1}. ${product.name} - $${product.price}`
            );

            console.log(
                `      🖼️ ${product.image}\n`
            );

        });


        console.log('✅ Database seeded successfully!');

        console.log(
            '\n🚀 Start the server: npm run dev'
        );

        console.log(
            `📱 Visit: http://localhost:${process.env.PORT || 3000}\n`
        );


        await mongoose.connection.close();

        process.exit(0);


    } catch (error) {

        console.error('❌ Error:', error);

        await mongoose.connection.close();

        process.exit(1);

    }

};


// =========================
// RUN SEED
// =========================

seedDatabase();