const Rating = require('../bd/models/rating')
const Book = require('../bd/models/book')
const {getManager} = require('typeorm')

//добавляем рейтинг в запись книги в таблице Book
async function setRatingSumInBook(bookId) {
    const ratingsRepository = await getManager().getRepository(Rating)
    const booksRepository = await getManager().getRepository(Book)
    //получаем оценки по книге и их количество
    const ratings = await ratingsRepository.findAndCount({
        select: ['rate'],
        where: {
            books: {id: bookId}
        }
    })
    //считаем среднюю оценку
    let summary = 0
    ratings[0].forEach(rating => {
        summary += rating.rate
    })

    const bookRating = summary / ratings[1]
    //обновляем оценку книги
    await booksRepository.update({id: bookId}, {rating: bookRating})
}

class RatingController {
    //получить оценку конкретного пользователя
    async getOne(ctx) {
        try {
            const {user} = ctx.request.body
            const {bookId} = ctx.request.query

            const ratingsRepository = await getManager().getRepository(Rating)
            //получаем оценку пользователя по определённой книге
            const userRate = await ratingsRepository.findOne({
                where: {
                    users: {id: user.id},
                    books: {id: bookId}
                }
            })

            return ctx.body = {userRate, status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //установить оценку
    async setRating(ctx) {
        try {
            const {rate, user, bookId} = ctx.request.body

            const ratingsRepository = await getManager().getRepository(Rating)
            //пользователь уже оценивал эту книгу?
            const consilience = await ratingsRepository.findOne({
                where: {
                    users: {id: user.id},
                    books: {id: bookId}
                }
            })
            //изменяем оценку, если пользователь уже оценивал данную книгу
            if (consilience) {
                await ratingsRepository.update({id: consilience.id}, {rate})
            }else {
                //добавляем оценку пользователя
                const newRate = ratingsRepository.create({rate})
                newRate.users = {id: user.id}
                newRate.books = {id: bookId}
                await ratingsRepository.save(newRate)
            }
            
            //перерасчёт оценки книги
            await setRatingSumInBook(bookId)

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //удалить оценку
    async deleteRating(ctx) {
        try {
            const {user, bookId} = ctx.request.body

            const ratingsRepository = await getManager().getRepository(Rating)
            //удаляем оценку
            await ratingsRepository.delete({users: {id: user.id}, books: {id: bookId}})
            //перерасчёт оценки книги
            await setRatingSumInBook(bookId)

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
}

module.exports = new RatingController()