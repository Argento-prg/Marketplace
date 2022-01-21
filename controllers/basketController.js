const Basket = require('../bd/models/basket')
const Book = require('../bd/models/book')
const {getManager} = require('typeorm')

class BasketController {
    //добавление товара в корзину
    async add(ctx) {
        try {
            const {user, bookId} = ctx.request.body
            //проверка на наличие товара
            const booksRepository = await getManager().getRepository(Book)
            const {quantity} = await booksRepository.findOne({
                select: ['quantity'],
                where: {id: bookId}
            })
            if (quantity === 0) {
                ctx.response.status = 400
                return ctx.body = {error: 'Товар закончился', status: false}
            }

            const basketsRepository = await getManager().getRepository(Basket)
            //есть ли эта позиция в корзине?
            const consilience = await basketsRepository.findOne({
                where: {
                    users: {id: user.id},
                    books: {id: bookId}
                }
            })
            if (consilience) {
                ctx.response.status = 400
                return ctx.body = {error: 'Товар уже в корзине', status: false}
            }

            //добавляем товар в корзину
            const newRecordBasket = basketsRepository.create({})
            newRecordBasket.users = {id: user.id}
            newRecordBasket.books = {id: bookId}

            await basketsRepository.save(newRecordBasket)

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //удаление товара из корзины
    async delete(ctx) {
        try {
            const {recordId} = ctx.request.body

            const basketsRepository = await getManager().getRepository(Basket)

            await basketsRepository.delete({id: recordId})

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //получение товаров, что в корзине, а также, суммы всей покупки
    async getAll(ctx) {
        try {
            const {user} = ctx.request.body

            const basketsRepository = await getManager().getRepository(Basket)
            //получаем все товары из корзины пользователя
            const records = await basketsRepository.find({
                where: {
                    users: {id: user.id}
                },
                relations: ['books']
            })
            //считаем сумму всей корзины
            let sum = 0
            records.forEach(record => {
                sum += (record.books.price * record.quantity)
            })

            return ctx.body = {records, sum, status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //задание количества товара в корзине
    async setQuantity(ctx) {
        try {
            const {id, bookId, quantityCurrent} = ctx.request.body

            const booksRepository = await getManager().getRepository(Book)
            //проверка, не превышает ли число единиц товара в корзине их наличие в базе
            const book = await booksRepository.findOne({id: bookId})

            if (quantityCurrent > book.quantity) {
                ctx.response.status = 400
                return ctx.body = {error: 'Достигнуто максимально доступное количество книг', status: false}
            }

            const basketsRepository = await getManager().getRepository(Basket)
            //обновляем запись в корзине
            await basketsRepository.update({id}, {quantity: quantityCurrent})
            
            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
    //покупка всех позиций из корзины
    async buyAll(ctx) {
        try {
            const {user} = ctx.request.body

            const basketsRepository = await getManager().getRepository(Basket)
            const booksRepository = await getManager().getRepository(Book)
            //получаем все позиции пользователя в корзине
            const positions = await basketsRepository.find({
                where: {
                    users: {id: user.id}
                },
                relations: ['books'] 
            })

            //удаляем позиции из корзины
            await basketsRepository.delete({
                    users: {id: user.id}
            })
            //перерасчёт количества книг
            await positions.forEach(position => {
                booksRepository.update(
                    {id: position.books.id},
                    {quantity: (position.books.quantity - position.quantity)}
                )
            })

            return ctx.body = {status: true}
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
}

module.exports = new BasketController()