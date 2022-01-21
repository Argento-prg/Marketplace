const Joi = require('joi')

const schema = Joi.object({
    id: Joi.number()
        .integer()
        .min(1),
    
    name: Joi.string()
        .pattern(new RegExp('^[a-zA-Zа-яА-Я .]{2,100}$'))    
})

module.exports = schema