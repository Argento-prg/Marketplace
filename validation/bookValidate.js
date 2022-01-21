const Joi = require('joi')

const schema = Joi.object({
    id: Joi.number().integer().min(1),
    
    name: Joi.string().pattern(new RegExp('^[a-zA-Zа-яА-Я ]{2,100}$')),
    
    date: Joi.number().integer().min(0),
    
    price: Joi.number().min(0),

    description: Joi.string().min(0).max(300),
    
    quantity: Joi.number().integer().min(0)
})

module.exports = schema