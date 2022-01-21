const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'Review',
    tableName: 'reviews',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        content: {
            type: 'text',
            nullable: false,
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