const Joi = require('joi')

const schema = Joi.object({
    id: Joi.number()
        .integer()
        .min(1),
    
    content: Joi.string()  
})

module.exports = schema