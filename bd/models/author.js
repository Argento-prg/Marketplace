const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'Author',
    tableName: 'authors',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            nullable: false
        }
    }
})