const {getManager} = require('typeorm')
const Author = require('../bd/models/author')
const authorValidator = require('../validation/authorValidate')

class AuthorController {
    //добавление нового автора
    async create(ctx) {
        try {
            const {name} = ctx.request.body
            //валидация имени автора
            if (authorValidator.validate({name}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            const authorsRepository = await getManager().getRepository(Author)
            //есть ли этот автор уже в базе?
            const consilience = await authorsRepository.findOne({name})
            if (consilience) {
                ctx.response.status = 400
                return ctx.body = {error: 'Автор уже в базе', status: false}
            }
            //добавляем автора
            const newAuthor = authorsRepository.create({name})
            await authorsRepository.save(newAuthor)

            return ctx.body = {status: true}
        } catch(e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //получить список всех авторов
    async getAll(ctx) {
        try {
            const authorsRepository = await getManager().getRepository(Author)
            const authors = await authorsRepository.find()

            return ctx.body = {authors, status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //обновить запись автора
    async update(ctx) {
        try {
            const {id, newName} = ctx.request.body
            //валидация имени автора и id
            if (authorValidator.validate({name: newName, id}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            const authorsRepository = await getManager().getRepository(Author)
            //есть ли этот автор в базе?
            const consilience = await authorsRepository.findOne({id})
            if (!consilience) {
                ctx.response.status = 400
                return ctx.body = {error: 'Этого автора нет в базе', status: false}
            }
            //обновляем данные
            await authorsRepository.update({id}, {name: newName})
            
            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //удалить запись автора по id из базы
    async delete(ctx) {
        try {
            const {id} = ctx.request.body
            //валидация id
            if (authorValidator.validate({id}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            const authorsRepository = await getManager().getRepository(Author)
            //существует ли данная запись в базе?
            const consilience = await authorsRepository.findOne({id})           
            if (!consilience) {
                ctx.response.status = 400
                return ctx.body = {error: 'Этого автора нет в базе', status: false}
            }
            //удаляем запись
            await authorsRepository.delete({id})

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
}

module.exports = new AuthorController()