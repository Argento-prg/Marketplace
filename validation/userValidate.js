const Joi = require('joi')

const schema = Joi.object({
    email: Joi.string()
        .email()
        .min(6)
        .max(100),
    
    password: Joi.string()
        .min(6)
        .max(30)
})

module.exports = schema