const User = require('../bd/models/user')
const userValidator = require('../validation/userValidate')
const {getManager} = require('typeorm')
const jwt = require('jsonwebtoken')
const {SecretKey, HashRound} = require('../config.json').CONSTANT
const bcrypt = require('bcrypt')

//генерация jwt-токена
const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        SecretKey,
        {expiresIn: '2h'}
    )
}

class UserController {
    //регистрация
    register(role) {
        return async (ctx) => {
            try {
                const {email, password} = ctx.request.body
                //валидация данных
                if (userValidator.validate({email, password}).error) {
                    ctx.response.status = 400
                    return ctx.body = {error: 'Некорректные данные', status: false}
                }

                const usersRepository = await getManager().getRepository(User)
                //существует ли пользователь с таким же email?
                const consilience = await usersRepository.findOne({email})
                if (consilience) {
                    ctx.response.status = 400
                    return ctx.body = {error: 'Email занят', status: false}
                }
                //хешируем пароль
                const hashPassword = await bcrypt.hash(password, HashRound)
                //добавляем пользователя
                const newUser = usersRepository.create({email, password: hashPassword, role})
                const addedUser = await usersRepository.save(newUser)
                //получаем токен
                const token = generateJwt(addedUser.id, addedUser.email, addedUser.role)
                
                return ctx.body = {token, status: true}
            } catch (e) {
                ctx.response.status = 400
                return ctx.body = {error: e, status: false}
            }
        }
    }
    //авторизация
    async login(ctx) {
        try {
            const {email, password} = ctx.request.body
            //валидация данных
            if (userValidator.validate({email, password}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }

            const usersRepository = await getManager().getRepository(User)
            //существует ли пользователь с этим email
            const consilience = await usersRepository.findOne({email})
            if (!consilience) {
                ctx.response.status = 400
                return ctx.body = {error: 'Такого пользователя не существует', status: false}
            }

            //проверка пароля
            const comparePassword = bcrypt.compareSync(password, consilience.password)
            
            if (!comparePassword) {
                ctx.response.status = 400
                return ctx.body = {error: 'Проверьте введённые данные', status: false}
            }
            //получаем токен
            const token = generateJwt(consilience.id, consilience.email, consilience.role)
            
            return ctx.body = {token, status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
}

module.exports = new UserController()