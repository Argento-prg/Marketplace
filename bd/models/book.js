const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'Book',
    tableName: 'books',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            nullable: false
        },
        date: {
            type: 'int',
        },
        price: {
            type: 'float',
            nullable: false
        },
        img: {
            type: 'varchar',
            nullable: false
        },
        description: {
            type: 'varchar',
            default: ''
        },
        quantity: {
            type: 'int',
            default: 0
        },
        rating: {
            type: 'float',
            default: 0,
            nullable: true
        }
    },
    relations: {
        ratings: {
            target: 'Rating',
            type: 'one-to-many'
        },
        reviews: {
            target: 'Review',
            type: 'one-to-many'
        },
        baskets: {
            target: 'Basket',
            type: 'one-to-many',
        },
        authors: {
            target: 'Author',
            type: 'many-to-one'
        }
    }
})