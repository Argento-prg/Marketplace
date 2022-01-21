const { exit } = require('process')
const typeorm = require('typeorm')

typeorm.createConnection()
.then(() => {
    console.log('Connection with BD is established')
})
.catch((error) => {
    console.log(`Error: ${error}`)
    process.exit(-1)
})