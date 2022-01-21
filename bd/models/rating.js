const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'Rating',
    tableName: 'ratings',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        rate: {
            type: 'int',
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