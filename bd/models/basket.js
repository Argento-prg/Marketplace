const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'Basket',
    tableName: 'baskets',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        quantity: {
            type: 'int',
            default: 1,
            nullable: false
        }
    },
    relations: {
        users: {
            target: 'User',
            type: 'many-to-one'
        },
        books: {
            target: 'Book',
            type: 'many-to-one'
        }
    }
})