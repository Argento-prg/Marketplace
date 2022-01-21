const Review = require('../bd/models/review')
const {getManager} = require('typeorm')
const {limit} = require('../config.json').CONSTANT
const reviewValidator = require('../validation/reviewValidate')

class ReviewController {
    //создание отзыва
    async create(ctx) {
        try {
            const {user, content, bookId} = ctx.request.body
            //валидация данных
            if (!content) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            if (reviewValidator.validate({id: bookId, content}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }

            const reviewsRepository = await getManager().getRepository(Review)

            //добавить новый отзыв
            const newReview = reviewsRepository.create({content})
            newReview.users = {id: user.id}
            newReview.books = {id: bookId}
            await reviewsRepository.save(newReview)

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //получение всех отзывов пользователя
    async getAllUser(ctx) {
        try {
            const {user} = ctx.request.body
            const {page} = ctx.request.query
            //расчёт отступа
            const offset = Number(page) * limit - limit

            const reviewsRepository = await getManager().getRepository(Review)
            //получаем отзывы пользователя
            const reviews = await reviewsRepository.findAndCount({
                where: {
                    users: {
                        id: user.id
                    }
                },
                skip: offset,
                take: limit,
                relations: ['books']
            })

            return ctx.body = {reviews: reviews[0], count: reviews[1], status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //получение всех отзывов по книге
    async getAllofBook(ctx) {
        try {
            const {page, bookId} = ctx.request.query
            //расчёт отступа
            const offset = Number(page) * limit - limit

            const reviewsRepository = await getManager().getRepository(Review)
            //получаем отзывы пользователя
            const reviews = await reviewsRepository.findAndCount({
                where: {
                    books: {
                        id: bookId
                    }
                },
                skip: offset,
                take: limit
            })

            return ctx.body = {reviews: reviews[0], count: reviews[1], status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //редактирование отзыва
    async update(ctx) {
        try {
            const {id, content} = ctx.request.body
            //валидация данных
            if (!content) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            if (reviewValidator.validate({id, content}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }

            const reviewsRepository = await getManager().getRepository(Review)
            //обновление записи отзыва
            await reviewsRepository.update({id}, {content})

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //удаление отзыва
    async delete(ctx) {
        try {
            const {id, user} = ctx.request.body
            //валидация данных
            if (reviewValidator.validate({id}).error) {
                ctx.response.status = 400
                return ctx.body = {error: 'Некорректные данные', status: false}
            }
            const reviewsRepository = await getManager().getRepository(Review)
            const review = await reviewsRepository.findOne(
                {
                    where: {id},
                    relations: ['users']
                }
            )

            //удалять отзыв имеет право автор или админ
            if (user.role !== 'admin' && review.users.id !== user.id) {
                ctx.response.status = 400
                return ctx.body = {error: 'Нет прав', status: false}
            }

            
            //удаление отзыва
            await reviewsRepository.delete({id})

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
}

module.exports = new ReviewController()