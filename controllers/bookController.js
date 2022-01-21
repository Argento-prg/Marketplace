const Book = require('../bd/models/book')
const {getManager, Like, In} = require('typeorm')
const bookValidator = require('../validation/bookValidate')
const uuid = require('uuid')
const path = require('path')
const {limit} = require('../config.json').CONSTANT
const fs = require('fs')

class BookController {
    //добавить новую книгу
    async create(ctx) {
        try {
            const {name, date, price, description, quantity, authorId} = ctx.request.body
            const {img} = ctx.request.files
            //валидация данных
            if (bookValidator.validate({name, date, price, quantity, description, id: authorId}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            if (!img) {
                ctx.response.status = 400
                return ctx.body = {error: 'Изображение не найдено', status: false}
            }
            //загружаем картинку как статику
            //с фронтенда картинки будут получаться по get запросу, как статика
            //создаём случайное название для картинки
            const fileName = uuid.v4() + '.jpg'
            //переименовываем пришедшую картинку
            fs.rename(
                path.resolve(img.path), 
                path.resolve(__dirname, '..', 'static', fileName),
                (err) => {err}
            )

            const booksRepository = await getManager().getRepository(Book)
            //есть ли эта книга уже в базе?
            const consilience = await booksRepository.findOne({ 
                relations: ['authors'],
                where: {
                    name,
                    authors: {id: authorId}
                }
            })
            if (consilience) {
                fs.rm(path.resolve(__dirname, '..', 'static', fileName), (err) => {err})
                ctx.response.status = 400
                return ctx.body = {error: 'Книга уже в базе', status: false}
            }
            //дабавляем книгу в базу данных
            const newBook = booksRepository.create({name, date, price, description, quantity, img: fileName})
            newBook.authors = {id: authorId}
            await booksRepository.save(newBook)

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //получить список всех книг
    async getAll(ctx) {
        try {
            const {page, authorId, searchTemplate} = ctx.request.query

            const booksRepository = await getManager().getRepository(Book)
            //получаем массив id авторов из строки для выборки книг по ним
            const authorIdArray = authorId.split(',')
            //считаем отступ
            const offset = Number(page) * limit - limit
            
            let books = undefined
            //если сделана выборка по авторам
            if (authorIdArray[0].length) {
                books = await booksRepository.findAndCount({
                    select: ['id', 'name', 'price', 'quantity', 'img', 'rating'],
                    skip: offset,
                    take: limit,
                    relations: ['authors'],
                    where: {
                        authors: {id: In(authorIdArray)},
                        name: Like(`%${searchTemplate}%`)
                    }
                })
            }
            //если не сделана выборка по авторам
            else {
                books = await booksRepository.findAndCount({
                    select: ['id', 'name', 'price', 'quantity', 'img', 'rating'],
                    skip: offset,
                    take: limit,
                    relations: ['authors'],
                    where: {
                        name: Like(`%${searchTemplate}%`)
                    }
                })
            }

            return ctx.body = {books: books[0], count: books[1], status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //получить полную информацию о книге
    async getOne(ctx) {
        try {
            const {id} = ctx.request.query

            const booksRepository = await getManager().getRepository(Book)
            //валидация данных
            if (bookValidator.validate({id}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            //полная информация о книге по id
            const book = await booksRepository.findOne({
                where: {id},
                relations: ['authors']
            })

            return ctx.body = {book, status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //обновить информацию о книге
    async update(ctx) {
        try {
            const {id, name, date, price, description, quantity, authorId, fileName} = ctx.request.body
            const {img} = ctx.request.files
            //валидация данных
            if (bookValidator.validate({name, date, price, quantity, description, id: authorId, id}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            if (!img) {
                ctx.response.status = 400
                return ctx.body = {error: 'Изображение не найдено', status: false}
            }
            //удаляем картинку из папки static
            fs.rm(path.resolve(__dirname, '..', 'static', fileName), (err) => {err})
            //переименовываем новую картинку на старое название
            fs.rename(
                path.resolve(img.path), 
                path.resolve(__dirname, '..', 'static', fileName),
                (err) => {err}
            )
            //обновляем данные о книге
            const booksRepository = await getManager().getRepository(Book)

            await booksRepository.update(
                {id}, 
                {name, date, price, description, quantity, img: fileName, authors: {id: authorId}}
            )

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //удалить книгу из базы данных
    async delete(ctx) {
        try {
            const {id, fileName} = ctx.request.body
            //валидация id
            if (bookValidator.validate({id}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            const booksRepository = await getManager().getRepository(Book)
            //существует ли данная запись в базе?
            const consilience = await booksRepository.findOne({id})
            if (!consilience) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            //удаляем картинку
            fs.rm(
                path.resolve(__dirname, '..', 'static', fileName), 
                (err) => {err}
            )
            //удаляем запись
            await booksRepository.delete({id})

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }   
    }
}

module.exports = new BookController()