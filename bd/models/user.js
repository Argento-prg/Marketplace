const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        email: {
            type: 'varchar',
            nullable: false
        },
        password: {
            type: 'varchar',
            nullable: false
        },
        role: {
            type: 'varchar',
            nullable: false
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
            type: 'one-to-many'
        }
    }
})