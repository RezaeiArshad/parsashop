import bcrypt from 'bcryptjs'

const data = {
    users: [
        {
            name: 'mehdi',
            email: "mehdirezaeiarshad@gmail.com",
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
        },
        {
            name: "parsa",
            email: "parsa@example.com",
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        }
    ],
    products: [
        {
            name: '50w adaptor',
            slug: '50w-adaptor',
            category: 'adaptors',
            image: '../public/levant-feature-charging-on-a-new-level-542582270.avif',
            price: 120000,
            countInStock: 3,
            brand: 'IranDoCo',
            rating: 2.5,
            numReviews: 14,
            description: 'high quality',
        },
                {
            name: '120w phone charger',
            slug: '120w-phone-charger',
            category: 'chargers',
            image: '../public/51tYeIpyDIL._UF894,1000_QL80_.jpg',
            price: 150000,
            countInStock: 0,
            brand: 'IranDoCo',
            rating: 3.5,
            numReviews: 50,
            description: 'high quality',

        },
                {
            name: 'laptop adaptor',
            slug: 'laptop-adaptor',
            category: 'adaptors',
            image: '../public/images.jpg',
            price: 220000,
            countInStock: 4,
            brand: 'IranDoCo',
            rating: 4.5,
            numReviews: 4,
            description: 'high quality',
        }
    ]
}

export default data